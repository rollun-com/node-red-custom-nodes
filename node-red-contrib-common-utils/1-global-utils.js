module.exports = function (RED) {
  // RED.events.on('nodes-started', e =>

  global.utils = {
    /**
     *
     * @return {*}
     * @param obj
     * @param path
     */
    resolvePath: function (obj, path) {
      path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      path = path.replace(/^\./, '');           // strip a leading dot
      var a = path.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (typeof obj === 'object' && k in obj) {
          obj = obj[k];
        } else {
          return;
        }
      }
      return obj;
    },

    /**
     *
     * @param val - input like str|12313, where str is type and 12313 is value.
     * @returns {string[]} - where first is type and second is value.
     */
    parseTypedInput: (val) => {
      const [type = '', ...value] = val.split('|');
      // if value contains '|'
      return [type, value.join('|')];
    },

    /**
     * get values from typed input
     * @param val - msg|payload
     * @param msg - msg
     * @return {string|*}
     */

    getTypedFieldValue: (msg, val = '') => {
      console.log(msg, val)
      if (!val) return '';
      const [type, value] = global.utils.parseTypedInput(val);
      if (type === 'msg') {
        return global.utils.resolvePath(msg, value);
      }
      // if (type === 'json') {
      //   return JSON.parse(val);
      // }
      return value;
    }
  };
};
