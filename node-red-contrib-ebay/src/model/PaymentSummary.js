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
import OrderRefund from './OrderRefund';
import Payment from './Payment';

/**
* The PaymentSummary model module.
* @module model/PaymentSummary
* @version v1.17.0
*/
export default class PaymentSummary {
    /**
    * Constructs a new <code>PaymentSummary</code>.
    * This type contains information about the various monetary exchanges that apply to the net balance due for the order.
    * @alias module:model/PaymentSummary
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>PaymentSummary</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/PaymentSummary} obj Optional instance to populate.
    * @return {module:model/PaymentSummary} The populated <code>PaymentSummary</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new PaymentSummary();
                        
            
            if (data.hasOwnProperty('payments')) {
                obj['payments'] = ApiClient.convertToType(data['payments'], [Payment]);
            }
            if (data.hasOwnProperty('refunds')) {
                obj['refunds'] = ApiClient.convertToType(data['refunds'], [OrderRefund]);
            }
            if (data.hasOwnProperty('totalDueSeller')) {
                obj['totalDueSeller'] = Amount.constructFromObject(data['totalDueSeller']);
            }
        }
        return obj;
    }

    /**
    * This array consists of payment information for the order, including payment status, payment method, payment amount, and payment date. This array is always returned, although some of the fields under this container will not be returned until payment has been made.
    * @member {Array.<module:model/Payment>} payments
    */
    'payments' = undefined;
    /**
    * This array is always returned, but is returned as an empty array unless the seller has submitted a partial or full refund to the buyer for the order. If a refund has occurred, the refund amount and refund date will be shown for each refund.
    * @member {Array.<module:model/OrderRefund>} refunds
    */
    'refunds' = undefined;
    /**
    * @member {module:model/Amount} totalDueSeller
    */
    'totalDueSeller' = undefined;




}
