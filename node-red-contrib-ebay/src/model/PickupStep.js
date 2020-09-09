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
* The PickupStep model module.
* @module model/PickupStep
* @version v1.17.0
*/
export default class PickupStep {
    /**
    * Constructs a new <code>PickupStep</code>.
    * This type is used to indicate the merchant&#x27;s store where the buyer will pickup their In-Store Pickup order. The pickupStep container is only returned for In-Store Pickup orders. The In-Store Pickup feature is supported in the US, Canada, UK, Germany, and Australia marketplaces.
    * @alias module:model/PickupStep
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>PickupStep</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/PickupStep} obj Optional instance to populate.
    * @return {module:model/PickupStep} The populated <code>PickupStep</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new PickupStep();
                        
            
            if (data.hasOwnProperty('merchantLocationKey')) {
                obj['merchantLocationKey'] = ApiClient.convertToType(data['merchantLocationKey'], 'String');
            }
        }
        return obj;
    }

    /**
    * A merchant-defined unique identifier of the merchant's store where the buyer will pick up their In-Store Pickup order. This field is always returned with the pickupStep container.
    * @member {String} merchantLocationKey
    */
    'merchantLocationKey' = undefined;




}
