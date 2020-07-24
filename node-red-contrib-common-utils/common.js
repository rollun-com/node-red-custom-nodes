module.exports = (function () {
  global.delovod = {
    util: {
      formatDelovodRequest: (params, action, {key, version}) => `packet=${JSON.stringify({
        version,
        key,
        action,
        params
      })}`,
      /**
       *
       * @param o - any object
       * @param s - path like 'a.b.c[0].b'
       * @return {*}
       */
      resolvePath: function (o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
          var k = a[i];
          if (typeof o === 'object' && k in o) {
            o = o[k];
          } else {
            return;
          }
        }
        return o;
      }
    },
    actions: {
      GET_OBJECT: 'getObject',
      SAVE_OBJECT: 'saveObject',
      SET_DEL_MARK: 'setDelMark',
      REQUEST: 'request'
    }
  }

  console.log('common');
})()
