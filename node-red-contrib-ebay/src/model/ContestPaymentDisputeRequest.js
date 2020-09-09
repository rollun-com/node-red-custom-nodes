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
import ReturnAddress from './ReturnAddress';

/**
* The ContestPaymentDisputeRequest model module.
* @module model/ContestPaymentDisputeRequest
* @version v1.17.0
*/
export default class ContestPaymentDisputeRequest {
    /**
    * Constructs a new <code>ContestPaymentDisputeRequest</code>.
    * This type is used by the request payload of the contestPaymentDispute method.
    * @alias module:model/ContestPaymentDisputeRequest
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>ContestPaymentDisputeRequest</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/ContestPaymentDisputeRequest} obj Optional instance to populate.
    * @return {module:model/ContestPaymentDisputeRequest} The populated <code>ContestPaymentDisputeRequest</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ContestPaymentDisputeRequest();
                        
            
            if (data.hasOwnProperty('returnAddress')) {
                obj['returnAddress'] = ReturnAddress.constructFromObject(data['returnAddress']);
            }
            if (data.hasOwnProperty('revision')) {
                obj['revision'] = ApiClient.convertToType(data['revision'], 'Number');
            }
        }
        return obj;
    }

    /**
    * @member {module:model/ReturnAddress} returnAddress
    */
    'returnAddress' = undefined;
    /**
    * This integer value indicates the revision number of the payment dispute. This field is required. The current revision number for a payment dispute can be retrieved with the getPaymentDispute method. Each time an action is taken against a payment dispute, this integer value increases by 1.
    * @member {Number} revision
    */
    'revision' = undefined;




}