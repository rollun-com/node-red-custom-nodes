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
    instance = new FulfillmentApi.ReturnAddress();
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

  describe('ReturnAddress', function() {
    it('should create an instance of ReturnAddress', function() {
      // uncomment below and update the code to test ReturnAddress
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be.a(FulfillmentApi.ReturnAddress);
    });

    it('should have the property addressLine1 (base name: "addressLine1")', function() {
      // uncomment below and update the code to test the property addressLine1
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property addressLine2 (base name: "addressLine2")', function() {
      // uncomment below and update the code to test the property addressLine2
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property city (base name: "city")', function() {
      // uncomment below and update the code to test the property city
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property country (base name: "country")', function() {
      // uncomment below and update the code to test the property country
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property county (base name: "county")', function() {
      // uncomment below and update the code to test the property county
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property fullName (base name: "fullName")', function() {
      // uncomment below and update the code to test the property fullName
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property postalCode (base name: "postalCode")', function() {
      // uncomment below and update the code to test the property postalCode
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property primaryPhone (base name: "primaryPhone")', function() {
      // uncomment below and update the code to test the property primaryPhone
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

    it('should have the property stateOrProvince (base name: "stateOrProvince")', function() {
      // uncomment below and update the code to test the property stateOrProvince
      //var instane = new FulfillmentApi.ReturnAddress();
      //expect(instance).to.be();
    });

  });

}));
