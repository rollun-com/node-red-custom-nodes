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

import ApiClient from '../ApiClient';

/**
* The LegacyReference model module.
* @module model/LegacyReference
* @version v1.17.0
*/
export default class LegacyReference {
    /**
    * Constructs a new <code>LegacyReference</code>.
    * Type defining the legacyReference container. This container is needed if the seller is issuing a refund for an individual order line item, and wishes to use an item ID and transaction ID to identify the order line item.
    * @alias module:model/LegacyReference
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>LegacyReference</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/LegacyReference} obj Optional instance to populate.
    * @return {module:model/LegacyReference} The populated <code>LegacyReference</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new LegacyReference();
                        
            
            if (data.hasOwnProperty('legacyItemId')) {
                obj['legacyItemId'] = ApiClient.convertToType(data['legacyItemId'], 'String');
            }
            if (data.hasOwnProperty('legacyTransactionId')) {
                obj['legacyTransactionId'] = ApiClient.convertToType(data['legacyTransactionId'], 'String');
            }
        }
        return obj;
    }

    /**
    * The unique identifier of a listing in legacy/Trading API format. Note: Both legacyItemId and legacyTransactionId are needed to identify an order line item.
    * @member {String} legacyItemId
    */
    'legacyItemId' = undefined;
    /**
    * The unique identifier of a sale/transaction in legacy/Trading API format. A 'transaction ID' is created once a buyer purchases a 'Buy It Now' item or if an auction listing ends with a winning bidder. Note: Both legacyItemId and legacyTransactionId are needed to identify an order line item.
    * @member {String} legacyTransactionId
    */
    'legacyTransactionId' = undefined;




}