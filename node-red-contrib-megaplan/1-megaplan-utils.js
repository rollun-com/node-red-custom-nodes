module.exports = (function () {
  const fs = require('fs');
  const URL = require('url');
  global.megaplan = {
    apiv3: class MegaplanAPIV3Client {
      /**
       *
       * @param config {{password: string, email: string, host: string}}
       */
      constructor(config) {
        this.email = config.email;
        this.password = config.password;

        this.axios = require('axios').create({
          baseURL: config.host
        });
        this.axios.interceptors.request.use(async config => {
          if (config.url === 'api/v3/auth/access_token') return config;
          const token = await this._getAuthToken();
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        })
      }


      /**
       *
       * @returns {null|string}
       * @private
       */
      _getCachedToken() {
        const cacheTokenFile = '/data/.megaplan-auth-token.json';
        try {
          if (fs.existsSync(cacheTokenFile)) {
            const file = fs.readFileSync(cacheTokenFile, 'utf8');
            const data = JSON.parse(file);
            if (!data.access_token || !data.expires_in || !data.created_at) {
              throw new Error('invalid file format - ' + file);
            }
            if ((Date.now() / 1000 - data.created_at) > data.expires_in) {
              throw new Error(`Token expired - now(${Date.now()}) - created at(${data.created_at}) = ${Date.now() / 1000 - data.created_at} > expires in(${data.expires_in})`)
            }
            return data.access_token;
          }
        } catch (err) {
          console.log('getting cached token error ', err);
          return null;
        }
      }

      async _getAuthToken() {
        const cachedToken = this._getCachedToken();
        if (cachedToken) {
          return cachedToken;
        }
        const data = {
          username: this.email,
          password: this.password,
          grant_type: 'password'
        };

        const payload = Object.entries(data).map(([key, val]) => `--12345
Content-Disposition: form-data; name="${key}"

${val}`).join('\n');

        const result = await this.axios.post('api/v3/auth/access_token', payload, {
          headers: {
            'content-type': 'multipart/form-data; boundary=12345'
          }
        });
        fs.writeFileSync('/data/.megaplan-auth-token.json', JSON.stringify({
          ...result.data,
          created_at: Math.floor(Date.now() / 1000)
        }))
        return result.data.access_token;
      }

      /**
       * Return entity id, supports id itself and link to entity in megaplan UI.
       */

      getEntityId(idString) {
        // if it is id itself
        if (/$[0-9]+^/.test(idString)) {
          return idString;
        }
        // if it is URL
        const {pathname} = URL.parse(idString);
        const [match] = pathname.match(/[0-9]+/);
        return match;
      }

      /**
       *
       * @param name
       * @param idString - link or id
       * @return {Promise<*>}
       */

      async getEntity(name, idString) {
        const [entity, action] = name.split('.');
        const defaultFilter = {"fields": ["positions", "program"]};
        const id = this.getEntityId(idString);
        return this.axios.get(`api/v3/${entity}/${id}${action ? `/${action}?${JSON.stringify(defaultFilter)}` : ''}`);
      }

      /**
       *
       * @param name
       * @param idString - link or id
       * @param body
       * @return {Promise<*>}
       */

      async updateEntity(name, idString, body = {}) {
        const id = this.getEntityId(idString);

        return this.axios.post(`api/v3/${name}/${id}`, body);
      }
    }
  }
})();

