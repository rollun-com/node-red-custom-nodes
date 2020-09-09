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
* The OrderLineItems model module.
* @module model/OrderLineItems
* @version v1.17.0
*/
export default class OrderLineItems {
    /**
    * Constructs a new <code>OrderLineItems</code>.
    * This type is used by the lineItems array that is used to identify one or more line items in the order with the payment dispute.
    * @alias module:model/OrderLineItems
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>OrderLineItems</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/OrderLineItems} obj Optional instance to populate.
    * @return {module:model/OrderLineItems} The populated <code>OrderLineItems</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new OrderLineItems();
                        
            
            if (data.hasOwnProperty('itemId')) {
                obj['itemId'] = ApiClient.convertToType(data['itemId'], 'String');
            }
            if (data.hasOwnProperty('lineItemId')) {
                obj['lineItemId'] = ApiClient.convertToType(data['lineItemId'], 'String');
            }
        }
        return obj;
    }

    /**
    * The unique identifier of the eBay listing associated with the order.
    * @member {String} itemId
    */
    'itemId' = undefined;
    /**
    * The unique identifier of the line item within the order. The lineItemId value is created once the buyer actually purchases the item, or if there is a commitment to buy (such as an auction that is won by the buyer, an accepted Best Offer, or other situation that does not require immediate payment from the buyer).
    * @member {String} lineItemId
    */
    'lineItemId' = undefined;




}
