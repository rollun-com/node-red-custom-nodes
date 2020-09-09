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

import ApiClient from "../ApiClient";
import ShippingFulfillment from '../model/ShippingFulfillment';
import ShippingFulfillmentDetails from '../model/ShippingFulfillmentDetails';
import ShippingFulfillmentPagedCollection from '../model/ShippingFulfillmentPagedCollection';

/**
* ShippingFulfillment service.
* @module api/ShippingFulfillmentApi
* @version v1.17.0
*/
export default class ShippingFulfillmentApi {

    /**
    * Constructs a new ShippingFulfillmentApi. 
    * @alias module:api/ShippingFulfillmentApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the createShippingFulfillment operation.
     * @callback module:api/ShippingFulfillmentApi~createShippingFulfillmentCallback
     * @param {String} error Error message, if any.
     * @param {Object} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * When you group an order&#x27;s line items into one or more packages, each package requires a corresponding plan for handling, addressing, and shipping; this is a shipping fulfillment. For each package, execute this call once to generate a shipping fulfillment associated with that package. Note: A single line item in an order can consist of multiple units of a purchased item, and one unit can consist of multiple parts or components. Although these components might be provided by the manufacturer in separate packaging, the seller must include all components of a given line item in the same package. Before using this call for a given package, you must determine which line items are in the package. If the package has been shipped, you should provide the date of shipment in the request. If not provided, it will default to the current date and time.
     * @param {module:api/ShippingFulfillmentApi~createShippingFulfillmentCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Object}
     */
    createShippingFulfillment(body, orderId, callback) {
      let postBody = body;

      let pathParams = {
        'orderId': orderId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['api_auth'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = Object;

      return this.apiClient.callApi(
        '/order/{orderId}/shipping_fulfillment', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the getShippingFulfillment operation.
     * @callback module:api/ShippingFulfillmentApi~getShippingFulfillmentCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ShippingFulfillment} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Use this call to retrieve the contents of a fulfillment based on its unique identifier, fulfillmentId (combined with the associated order&#x27;s orderId). The fulfillmentId value was originally generated by the createShippingFulfillment call, and is returned by the getShippingFulfillments call in the members.fulfillmentId field.
     * @param {module:api/ShippingFulfillmentApi~getShippingFulfillmentCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ShippingFulfillment}
     */
    getShippingFulfillment(fulfillmentId, orderId, callback) {
      let postBody = null;

      let pathParams = {
        'fulfillmentId': fulfillmentId,
        'orderId': orderId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['api_auth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ShippingFulfillment;

      return this.apiClient.callApi(
        '/order/{orderId}/shipping_fulfillment/{fulfillmentId}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the getShippingFulfillments operation.
     * @callback module:api/ShippingFulfillmentApi~getShippingFulfillmentsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ShippingFulfillmentPagedCollection} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Use this call to retrieve the contents of all fulfillments currently defined for a specified order based on the order&#x27;s unique identifier, orderId. This value is returned in the getOrders call&#x27;s members.orderId field when you search for orders by creation date or shipment status.
     * @param {module:api/ShippingFulfillmentApi~getShippingFulfillmentsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ShippingFulfillmentPagedCollection}
     */
    getShippingFulfillments(orderId, callback) {
      let postBody = null;

      let pathParams = {
        'orderId': orderId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['api_auth'];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ShippingFulfillmentPagedCollection;

      return this.apiClient.callApi(
        '/order/{orderId}/shipping_fulfillment', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}