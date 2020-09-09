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
    instance = new FulfillmentApi.PaymentSummary();
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

  describe('PaymentSummary', function() {
    it('should create an instance of PaymentSummary', function() {
      // uncomment below and update the code to test PaymentSummary
      //var instane = new FulfillmentApi.PaymentSummary();
      //expect(instance).to.be.a(FulfillmentApi.PaymentSummary);
    });

    it('should have the property payments (base name: "payments")', function() {
      // uncomment below and update the code to test the property payments
      //var instane = new FulfillmentApi.PaymentSummary();
      //expect(instance).to.be();
    });

    it('should have the property refunds (base name: "refunds")', function() {
      // uncomment below and update the code to test the property refunds
      //var instane = new FulfillmentApi.PaymentSummary();
      //expect(instance).to.be();
    });

    it('should have the property totalDueSeller (base name: "totalDueSeller")', function() {
      // uncomment below and update the code to test the property totalDueSeller
      //var instane = new FulfillmentApi.PaymentSummary();
      //expect(instance).to.be();
    });

  });

}));