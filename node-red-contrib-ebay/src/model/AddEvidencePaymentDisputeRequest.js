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
import FileEvidence from './FileEvidence';
import OrderLineItems from './OrderLineItems';

/**
* The AddEvidencePaymentDisputeRequest model module.
* @module model/AddEvidencePaymentDisputeRequest
* @version v1.17.0
*/
export default class AddEvidencePaymentDisputeRequest {
    /**
    * Constructs a new <code>AddEvidencePaymentDisputeRequest</code>.
    * This type is used by the request payload of the addEvidence method. The addEvidence method is used to create a new evidence set against a payment dispute with one or more evidence files.
    * @alias module:model/AddEvidencePaymentDisputeRequest
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>AddEvidencePaymentDisputeRequest</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/AddEvidencePaymentDisputeRequest} obj Optional instance to populate.
    * @return {module:model/AddEvidencePaymentDisputeRequest} The populated <code>AddEvidencePaymentDisputeRequest</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new AddEvidencePaymentDisputeRequest();
                        
            
            if (data.hasOwnProperty('evidenceType')) {
                obj['evidenceType'] = ApiClient.convertToType(data['evidenceType'], 'String');
            }
            if (data.hasOwnProperty('files')) {
                obj['files'] = ApiClient.convertToType(data['files'], [FileEvidence]);
            }
            if (data.hasOwnProperty('lineItems')) {
                obj['lineItems'] = ApiClient.convertToType(data['lineItems'], [OrderLineItems]);
            }
        }
        return obj;
    }

    /**
    * This field is used to indicate the type of evidence being provided through one or more evidence files. All evidence files (if more than one) should be associated with the evidence type passed in this field. See the EvidenceTypeEnum type for the supported evidence types. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/sell/fulfillment/types/api:EvidenceTypeEnum'>eBay API documentation</a>
    * @member {String} evidenceType
    */
    'evidenceType' = undefined;
    /**
    * This array is used to specify one or more evidence files that will become part of a new evidence set associated with a payment dispute. At least one evidence file must be specified in the files array. The unique identifier of an evidence file is returned in the response payload of the uploadEvidence method.
    * @member {Array.<module:model/FileEvidence>} files
    */
    'files' = undefined;
    /**
    * This required array identifies the order line item(s) for which the evidence file(s) will be applicable. Both the itemId and lineItemID fields are needed to identify each order line item, and both of these values are returned under the evidenceRequests.lineItems array in the getPaymentDispute response.
    * @member {Array.<module:model/OrderLineItems>} lineItems
    */
    'lineItems' = undefined;




}
