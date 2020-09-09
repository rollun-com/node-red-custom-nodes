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
import ErrorParameter from './ErrorParameter';

/**
* The Error model module.
* @module model/Error
* @version v1.17.0
*/
export default class Error {
    /**
    * Constructs a new <code>Error</code>.
    * This type contains a error or warning related to a call request.
    * @alias module:model/Error
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>Error</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/Error} obj Optional instance to populate.
    * @return {module:model/Error} The populated <code>Error</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Error();
                        
            
            if (data.hasOwnProperty('category')) {
                obj['category'] = ApiClient.convertToType(data['category'], 'String');
            }
            if (data.hasOwnProperty('domain')) {
                obj['domain'] = ApiClient.convertToType(data['domain'], 'String');
            }
            if (data.hasOwnProperty('errorId')) {
                obj['errorId'] = ApiClient.convertToType(data['errorId'], 'Number');
            }
            if (data.hasOwnProperty('inputRefIds')) {
                obj['inputRefIds'] = ApiClient.convertToType(data['inputRefIds'], ['String']);
            }
            if (data.hasOwnProperty('longMessage')) {
                obj['longMessage'] = ApiClient.convertToType(data['longMessage'], 'String');
            }
            if (data.hasOwnProperty('message')) {
                obj['message'] = ApiClient.convertToType(data['message'], 'String');
            }
            if (data.hasOwnProperty('outputRefIds')) {
                obj['outputRefIds'] = ApiClient.convertToType(data['outputRefIds'], ['String']);
            }
            if (data.hasOwnProperty('parameters')) {
                obj['parameters'] = ApiClient.convertToType(data['parameters'], [ErrorParameter]);
            }
            if (data.hasOwnProperty('subdomain')) {
                obj['subdomain'] = ApiClient.convertToType(data['subdomain'], 'String');
            }
        }
        return obj;
    }

    /**
    * The context or source of this error or warning.
    * @member {String} category
    */
    'category' = undefined;
    /**
    * The name of the domain containing the service or application. For example, sell is a domain.
    * @member {String} domain
    */
    'domain' = undefined;
    /**
    * A positive integer that uniquely identifies the specific error condition that occurred. Your application can use these values as error code identifiers in your customized error-handling algorithms.
    * @member {Number} errorId
    */
    'errorId' = undefined;
    /**
    * A list of one or more specific request elements (if any) associated with the error or warning. The format of these strings depends on the request payload format. For JSON, use JSONPath notation.
    * @member {Array.<String>} inputRefIds
    */
    'inputRefIds' = undefined;
    /**
    * An expanded version of the message field. Maximum length: 200 characters
    * @member {String} longMessage
    */
    'longMessage' = undefined;
    /**
    * A message about the error or warning which is device agnostic and readable by end users and application developers. It explains what the error or warning is, and how to fix it (in a general sense). If applicable, the value is localized to the end user's requested locale. Maximum length: 50 characters
    * @member {String} message
    */
    'message' = undefined;
    /**
    * A list of one or more specific response elements (if any) associated with the error or warning. The format of these strings depends on the request payload format. For JSON, use JSONPath notation.
    * @member {Array.<String>} outputRefIds
    */
    'outputRefIds' = undefined;
    /**
    * Contains a list of name/value pairs that provide additional information concerning this error or warning. Each item in the list is an input parameter that contributed to the error or warning condition.
    * @member {Array.<module:model/ErrorParameter>} parameters
    */
    'parameters' = undefined;
    /**
    * The name of the domain's subsystem or subdivision. For example, fulfillment is a subdomain in the sell domain.
    * @member {String} subdomain
    */
    'subdomain' = undefined;




}