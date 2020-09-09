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
import OrderLineItems from './OrderLineItems';

/**
* The EvidenceRequest model module.
* @module model/EvidenceRequest
* @version v1.17.0
*/
export default class EvidenceRequest {
    /**
    * Constructs a new <code>EvidenceRequest</code>.
    * This type is used by the evidenceRequests array that is returned in the getPaymentDispute response if one or more evidential documents are being requested to help resolve the payment dispute.
    * @alias module:model/EvidenceRequest
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>EvidenceRequest</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/EvidenceRequest} obj Optional instance to populate.
    * @return {module:model/EvidenceRequest} The populated <code>EvidenceRequest</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new EvidenceRequest();
                        
            
            if (data.hasOwnProperty('evidenceId')) {
                obj['evidenceId'] = ApiClient.convertToType(data['evidenceId'], 'String');
            }
            if (data.hasOwnProperty('evidenceType')) {
                obj['evidenceType'] = ApiClient.convertToType(data['evidenceType'], 'String');
            }
            if (data.hasOwnProperty('lineItems')) {
                obj['lineItems'] = ApiClient.convertToType(data['lineItems'], [OrderLineItems]);
            }
            if (data.hasOwnProperty('requestDate')) {
                obj['requestDate'] = ApiClient.convertToType(data['requestDate'], 'String');
            }
            if (data.hasOwnProperty('respondByDate')) {
                obj['respondByDate'] = ApiClient.convertToType(data['respondByDate'], 'String');
            }
        }
        return obj;
    }

    /**
    * Unique identifier of the evidential file set. Potentially, each evidential file set can have more than one file, that is why there is this file set identifier, and then an identifier for each file within this file set.
    * @member {String} evidenceId
    */
    'evidenceId' = undefined;
    /**
    * This enumeration value shows the type of evidential document provided. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/sell/fulfillment/types/api:EvidenceTypeEnum'>eBay API documentation</a>
    * @member {String} evidenceType
    */
    'evidenceType' = undefined;
    /**
    * This array shows one or more order line items associated with the evidential document that has been provided.
    * @member {Array.<module:model/OrderLineItems>} lineItems
    */
    'lineItems' = undefined;
    /**
    * The timestamp in this field shows the date/time when eBay requested the evidential document from the seller in response to a payment dispute. The timestamps returned here use the ISO-8601 24-hour date and time format, and the time zone used is Universal Coordinated Time (UTC), also known as Greenwich Mean Time (GMT), or Zulu. The ISO-8601 format looks like this: yyyy-MM-ddThh:mm.ss.sssZ. An example would be 2019-08-04T19:09:02.768Z.
    * @member {String} requestDate
    */
    'requestDate' = undefined;
    /**
    * The timestamp in this field shows the date/time when the seller is expected to provide a requested evidential document to eBay. The timestamps returned here use the ISO-8601 24-hour date and time format, and the time zone used is Universal Coordinated Time (UTC), also known as Greenwich Mean Time (GMT), or Zulu. The ISO-8601 format looks like this: yyyy-MM-ddThh:mm.ss.sssZ. An example would be 2019-08-04T19:09:02.768Z.
    * @member {String} respondByDate
    */
    'respondByDate' = undefined;




}
