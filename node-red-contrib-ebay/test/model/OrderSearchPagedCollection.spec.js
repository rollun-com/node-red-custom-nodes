/**
 * Fulfillment API
 * Use the Fulfillment API to complete the process of packaging, addressing, handling, and shipping each order on behalf of the seller, in accordance with the payment method and timing specified at checkout.
 *
 * OpenAPI spec version: v1.17.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.FulfillmentApi);
  }
}(this, function(expect, FulfillmentApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new FulfillmentApi.OrderSearchPagedCollection();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('OrderSearchPagedCollection', function() {
    it('should create an instance of OrderSearchPagedCollection', function() {
      // uncomment below and update the code to test OrderSearchPagedCollection
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be.a(FulfillmentApi.OrderSearchPagedCollection);
    });

    it('should have the property href (base name: "href")', function() {
      // uncomment below and update the code to test the property href
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property limit (base name: "limit")', function() {
      // uncomment below and update the code to test the property limit
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property next (base name: "next")', function() {
      // uncomment below and update the code to test the property next
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property offset (base name: "offset")', function() {
      // uncomment below and update the code to test the property offset
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property orders (base name: "orders")', function() {
      // uncomment below and update the code to test the property orders
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property prev (base name: "prev")', function() {
      // uncomment below and update the code to test the property prev
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property total (base name: "total")', function() {
      // uncomment below and update the code to test the property total
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

    it('should have the property warnings (base name: "warnings")', function() {
      // uncomment below and update the code to test the property warnings
      //var instane = new FulfillmentApi.OrderSearchPagedCollection();
      //expect(instance).to.be();
    });

  });

}));