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
import ExtendedContact from './ExtendedContact';

/**
* The ShippingStep model module.
* @module model/ShippingStep
* @version v1.17.0
*/
export default class ShippingStep {
    /**
    * Constructs a new <code>ShippingStep</code>.
    * This type contains shipping information for a fulfillment, including the shipping carrier, the shipping service option, the shipment destination, and the Global Shipping Program reference ID.
    * @alias module:model/ShippingStep
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>ShippingStep</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/ShippingStep} obj Optional instance to populate.
    * @return {module:model/ShippingStep} The populated <code>ShippingStep</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ShippingStep();
                        
            
            if (data.hasOwnProperty('shippingCarrierCode')) {
                obj['shippingCarrierCode'] = ApiClient.convertToType(data['shippingCarrierCode'], 'String');
            }
            if (data.hasOwnProperty('shippingServiceCode')) {
                obj['shippingServiceCode'] = ApiClient.convertToType(data['shippingServiceCode'], 'String');
            }
            if (data.hasOwnProperty('shipTo')) {
                obj['shipTo'] = ExtendedContact.constructFromObject(data['shipTo']);
            }
            if (data.hasOwnProperty('shipToReferenceId')) {
                obj['shipToReferenceId'] = ApiClient.convertToType(data['shipToReferenceId'], 'String');
            }
        }
        return obj;
    }

    /**
    * The unique identifier of the shipping carrier being used to ship the line item. Note: The Trading API's GeteBayDetails call can be used to retrieve the latest shipping carrier and shipping service option enumeration values.
    * @member {String} shippingCarrierCode
    */
    'shippingCarrierCode' = undefined;
    /**
    * The unique identifier of the shipping service option being used to ship the line item. Note: Use the Trading API's GeteBayDetails call to retrieve the latest shipping carrier and shipping service option enumeration values. When making the GeteBayDetails call, include the DetailName field in the request payload and set its value to ShippingServiceDetails. Each valid shipping service option (returned in ShippingServiceDetails.ShippingService field) and corresponding shipping carrier (returned in ShippingServiceDetails.ShippingCarrier field) is returned in response payload.
    * @member {String} shippingServiceCode
    */
    'shippingServiceCode' = undefined;
    /**
    * @member {module:model/ExtendedContact} shipTo
    */
    'shipTo' = undefined;
    /**
    * This is the unique identifer of the Global Shipping Program (GSP) shipment. This field is only returned if the line item is being shipped via GSP (the value of the fulfillmentStartInstructions.ebaySupportedFulfillment field will be true. The international shipping provider uses the shipToReferenceId value as the primary reference number to retrieve the relevant details about the buyer, the order, and the fulfillment, so the shipment can be completed. Sellers must include this value on the shipping label immediately above the street address of the international shipping provider. Example: &quot;Reference #1234567890123456&quot; Note: This value is the same as the ShipToAddress.ReferenceID value returned by the Trading API's GetOrders call.
    * @member {String} shipToReferenceId
    */
    'shipToReferenceId' = undefined;




}