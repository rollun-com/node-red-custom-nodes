const {resolvePayload} = require("../node-red-contrib-common-utils/1-global-utils");
const {WrapperArray, InstanceArray, Packer, Product, Wrapper} = require("3d-bin-packing");

module.exports = function (RED) {
  function PackagePacker(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    this.config = RED.nodes.getNode(config.config);

    node.on('input', function (msg) {
      const makeError = (node, text) => {
        msg.payload = {error: text};
        node.send([msg, null])
      };

      if (!config.containers) return makeError(node, `'containers' prop is required!`);
      if (!config.products) return makeError(node, `'products' prop is required!`);

      try {
        const containers = resolvePayload(msg, config.containers);
        const wrappers = resolvePayload(msg, config.products);
        const wrapperArray = new WrapperArray();
        const instanceArray = new InstanceArray();

        for (const container of containers) {
          wrapperArray.push(
            new Wrapper(container.name, container.price, container.width, container.height, container.length, container.thickness),
          );
        }
        for (const wrapper of wrappers) {
          instanceArray.insert(instanceArray.end(), wrapper.quantity, new Product(wrapper.name, wrapper.width, wrapper.height, wrapper.length))
        }
        const packer = new Packer(wrapperArray, instanceArray);

        const result = packer.optimize();
        const resultContainers = result.data_.map(wrapper => ({
          name: wrapper.getName(),
          width: wrapper.getWidth(),
          height: wrapper.getHeight(),
          length: wrapper.getLength(),
          spaceUtilization: wrapper.getUtilization()
        }));
        const items = result.data_.reduce((acc, wrapper) => {
          return acc.concat(wrapper.matrix_.reduce((rows, row) => {
            return rows.concat(row.map(item => ({
              name: item.instance.getName(),
              position: {
                x: item.x,
                y: item.y,
                z: item.z
              },
              layoutScale: {
                width: item.instance.getWidth(),
                height: item.instance.getHeight(),
                length: item.instance.getLength(),
              }
            })));
          }, []));
        }, []);

        msg.payload = {
          cost: result.getPrice(),
          containersCount: resultContainers.length,
          containers: resultContainers,
          items: items,
        };
        return node.send([null, msg]);
      } catch (e) {
        msg.payload = {
          error: e.message,
        }
        return node.send([msg, null]);
      }
    });
  }

  RED.nodes.registerType("package-packer", PackagePacker);
}
