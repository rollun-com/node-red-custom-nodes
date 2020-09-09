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
import PaymentHold from './PaymentHold';

/**
* The Payment model module.
* @module model/Payment
* @version v1.17.0
*/
export default class Payment {
    /**
    * Constructs a new <code>Payment</code>.
    * This type is used to provide details about the seller payments for an order.
    * @alias module:model/Payment
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>Payment</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/Payment} obj Optional instance to populate.
    * @return {module:model/Payment} The populated <code>Payment</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Payment();
                        
            
            if (data.hasOwnProperty('amount')) {
                obj['amount'] = Amount.constructFromObject(data['amount']);
            }
            if (data.hasOwnProperty('paymentDate')) {
                obj['paymentDate'] = ApiClient.convertToType(data['paymentDate'], 'String');
            }
            if (data.hasOwnProperty('paymentHolds')) {
                obj['paymentHolds'] = ApiClient.convertToType(data['paymentHolds'], [PaymentHold]);
            }
            if (data.hasOwnProperty('paymentMethod')) {
                obj['paymentMethod'] = ApiClient.convertToType(data['paymentMethod'], 'String');
            }
            if (data.hasOwnProperty('paymentReferenceId')) {
                obj['paymentReferenceId'] = ApiClient.convertToType(data['paymentReferenceId'], 'String');
            }
            if (data.hasOwnProperty('paymentStatus')) {
                obj['paymentStatus'] = ApiClient.convertToType(data['paymentStatus'], 'String');
            }
        }
        return obj;
    }

    /**
    * @member {module:model/Amount} amount
    */
    'amount' = undefined;
    /**
    * The date and time that the payment was received by the seller. This field will not be returned if buyer has yet to pay for the order. This timestamp is in ISO 8601 format, which uses the 24-hour Universal Coordinated Time (UTC) clock. Format: [YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].[sss]Z Example: 2015-08-04T19:09:02.768Z
    * @member {String} paymentDate
    */
    'paymentDate' = undefined;
    /**
    * This container is only returned if eBay is temporarily holding the seller's funds for the order. If a payment hold has been placed on the order, this container includes the reason for the payment hold, the expected release date of the funds into the seller's account, the current state of the hold, and as soon as the payment hold has been released, the actual release date.
    * @member {Array.<module:model/PaymentHold>} paymentHolds
    */
    'paymentHolds' = undefined;
    /**
    * The payment method used to pay for the order. See the PaymentMethodTypeEnum type for more information on the payment methods. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/sell/fulfillment/types/sel:PaymentMethodTypeEnum'>eBay API documentation</a>
    * @member {String} paymentMethod
    */
    'paymentMethod' = undefined;
    /**
    * This field is only returned if payment has been made by the buyer, and the paymentMethod is PAYPAL or ESCROW. This field contains the PayPal-generated transaction identifier in case of payment made via PAYPAL.
    * @member {String} paymentReferenceId
    */
    'paymentReferenceId' = undefined;
    /**
    * The enumeration value returned in this field indicates the status of the payment for the order. See the PaymentStatusEnum type definition for more information on the possible payment states. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/sell/fulfillment/types/sel:PaymentStatusEnum'>eBay API documentation</a>
    * @member {String} paymentStatus
    */
    'paymentStatus' = undefined;




}