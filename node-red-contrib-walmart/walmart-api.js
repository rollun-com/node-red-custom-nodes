module.exports = class WalmartAPI {
  constructor({clientId, clientSecret,}) {

    this.axios = require('axios').create({
      baseURL: 'https://marketplace.walmartapis.com'
    })

    this.authToken = null;

    this.axios.interceptors.request.use(async config => {
      if (config.url === 'v3/token') return config;
      const token = await this._getAuthToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    })
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


}
