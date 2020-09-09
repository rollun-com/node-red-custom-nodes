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
import Amount from './Amount';

/**
* The PricingSummary model module.
* @module model/PricingSummary
* @version v1.17.0
*/
export default class PricingSummary {
    /**
    * Constructs a new <code>PricingSummary</code>.
    * This type contains a summary of cumulative costs and charges for all line items of an order, including item price, price adjustments, sales taxes, delivery costs, and order discounts.
    * @alias module:model/PricingSummary
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>PricingSummary</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/PricingSummary} obj Optional instance to populate.
    * @return {module:model/PricingSummary} The populated <code>PricingSummary</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new PricingSummary();
                        
            
            if (data.hasOwnProperty('adjustment')) {
                obj['adjustment'] = Amount.constructFromObject(data['adjustment']);
            }
            if (data.hasOwnProperty('deliveryCost')) {
                obj['deliveryCost'] = Amount.constructFromObject(data['deliveryCost']);
            }
            if (data.hasOwnProperty('deliveryDiscount')) {
                obj['deliveryDiscount'] = Amount.constructFromObject(data['deliveryDiscount']);
            }
            if (data.hasOwnProperty('fee')) {
                obj['fee'] = Amount.constructFromObject(data['fee']);
            }
            if (data.hasOwnProperty('priceDiscountSubtotal')) {
                obj['priceDiscountSubtotal'] = Amount.constructFromObject(data['priceDiscountSubtotal']);
            }
            if (data.hasOwnProperty('priceSubtotal')) {
                obj['priceSubtotal'] = Amount.constructFromObject(data['priceSubtotal']);
            }
            if (data.hasOwnProperty('tax')) {
                obj['tax'] = Amount.constructFromObject(data['tax']);
            }
            if (data.hasOwnProperty('total')) {
                obj['total'] = Amount.constructFromObject(data['total']);
            }
        }
        return obj;
    }

    /**
    * @member {module:model/Amount} adjustment
    */
    'adjustment' = undefined;
    /**
    * @member {module:model/Amount} deliveryCost
    */
    'deliveryCost' = undefined;
    /**
    * @member {module:model/Amount} deliveryDiscount
    */
    'deliveryDiscount' = undefined;
    /**
    * @member {module:model/Amount} fee
    */
    'fee' = undefined;
    /**
    * @member {module:model/Amount} priceDiscountSubtotal
    */
    'priceDiscountSubtotal' = undefined;
    /**
    * @member {module:model/Amount} priceSubtotal
    */
    'priceSubtotal' = undefined;
    /**
    * @member {module:model/Amount} tax
    */
    'tax' = undefined;
    /**
    * @member {module:model/Amount} total
    */
    'total' = undefined;




}
