module.exports = (function () {

  global.utils = {
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
          o = o[k];``
        } else {
          return;
        }
      }
      return o;
    },
    /**
     *
     * @param val - input like str|12313, where str is type and 12313 is value.
     * @returns {string[]} - where first is type and second is value.
     */
    parseTypedInput: (val) => {
      const [type = '', value = ''] = val.split('|');
      return [type, value];
    },

  };

  global.delovod = {
    util: {
      formatDelovodRequest: (params, action, {key, version}) => `packet=${JSON.stringify({
        version,
        key,
        action,
        params
      })}`,
    },
    actions: {
      GET_OBJECT: 'getObject',
      SAVE_OBJECT: 'saveObject',
      SET_DEL_MARK: 'setDelMark',
      REQUEST: 'request'
    }
  };

  console.log('common');
})();
