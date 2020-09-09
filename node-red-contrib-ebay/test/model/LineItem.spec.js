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
    instance = new FulfillmentApi.LineItem();
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

  describe('LineItem', function() {
    it('should create an instance of LineItem', function() {
      // uncomment below and update the code to test LineItem
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be.a(FulfillmentApi.LineItem);
    });

    it('should have the property appliedPromotions (base name: "appliedPromotions")', function() {
      // uncomment below and update the code to test the property appliedPromotions
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property deliveryCost (base name: "deliveryCost")', function() {
      // uncomment below and update the code to test the property deliveryCost
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property discountedLineItemCost (base name: "discountedLineItemCost")', function() {
      // uncomment below and update the code to test the property discountedLineItemCost
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property ebayCollectAndRemitTaxes (base name: "ebayCollectAndRemitTaxes")', function() {
      // uncomment below and update the code to test the property ebayCollectAndRemitTaxes
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property giftDetails (base name: "giftDetails")', function() {
      // uncomment below and update the code to test the property giftDetails
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property legacyItemId (base name: "legacyItemId")', function() {
      // uncomment below and update the code to test the property legacyItemId
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property legacyVariationId (base name: "legacyVariationId")', function() {
      // uncomment below and update the code to test the property legacyVariationId
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property lineItemCost (base name: "lineItemCost")', function() {
      // uncomment below and update the code to test the property lineItemCost
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property lineItemFulfillmentInstructions (base name: "lineItemFulfillmentInstructions")', function() {
      // uncomment below and update the code to test the property lineItemFulfillmentInstructions
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property lineItemFulfillmentStatus (base name: "lineItemFulfillmentStatus")', function() {
      // uncomment below and update the code to test the property lineItemFulfillmentStatus
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property lineItemId (base name: "lineItemId")', function() {
      // uncomment below and update the code to test the property lineItemId
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property listingMarketplaceId (base name: "listingMarketplaceId")', function() {
      // uncomment below and update the code to test the property listingMarketplaceId
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property properties (base name: "properties")', function() {
      // uncomment below and update the code to test the property properties
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property purchaseMarketplaceId (base name: "purchaseMarketplaceId")', function() {
      // uncomment below and update the code to test the property purchaseMarketplaceId
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property quantity (base name: "quantity")', function() {
      // uncomment below and update the code to test the property quantity
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property refunds (base name: "refunds")', function() {
      // uncomment below and update the code to test the property refunds
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property sku (base name: "sku")', function() {
      // uncomment below and update the code to test the property sku
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property soldFormat (base name: "soldFormat")', function() {
      // uncomment below and update the code to test the property soldFormat
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property taxes (base name: "taxes")', function() {
      // uncomment below and update the code to test the property taxes
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property title (base name: "title")', function() {
      // uncomment below and update the code to test the property title
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

    it('should have the property total (base name: "total")', function() {
      // uncomment below and update the code to test the property total
      //var instane = new FulfillmentApi.LineItem();
      //expect(instance).to.be();
    });

  });

}));