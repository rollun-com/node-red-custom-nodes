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
    instance = new FulfillmentApi.DisputeEvidence();
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

  describe('DisputeEvidence', function() {
    it('should create an instance of DisputeEvidence', function() {
      // uncomment below and update the code to test DisputeEvidence
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be.a(FulfillmentApi.DisputeEvidence);
    });

    it('should have the property evidenceId (base name: "evidenceId")', function() {
      // uncomment below and update the code to test the property evidenceId
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property evidenceType (base name: "evidenceType")', function() {
      // uncomment below and update the code to test the property evidenceType
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property files (base name: "files")', function() {
      // uncomment below and update the code to test the property files
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property lineItems (base name: "lineItems")', function() {
      // uncomment below and update the code to test the property lineItems
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property providedDate (base name: "providedDate")', function() {
      // uncomment below and update the code to test the property providedDate
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property requestDate (base name: "requestDate")', function() {
      // uncomment below and update the code to test the property requestDate
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property respondByDate (base name: "respondByDate")', function() {
      // uncomment below and update the code to test the property respondByDate
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

    it('should have the property shipmentTracking (base name: "shipmentTracking")', function() {
      // uncomment below and update the code to test the property shipmentTracking
      //var instane = new FulfillmentApi.DisputeEvidence();
      //expect(instance).to.be();
    });

  });

}));
