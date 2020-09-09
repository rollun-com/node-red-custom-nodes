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
import TrackingInfo from './TrackingInfo';

/**
* The InfoFromBuyer model module.
* @module model/InfoFromBuyer
* @version v1.17.0
*/
export default class InfoFromBuyer {
    /**
    * Constructs a new <code>InfoFromBuyer</code>.
    * This container is returned if the buyer is returning one or more line items in an order that is associated with the payment dispute, and that buyer has provided return shipping tracking information and/or a note about the return.
    * @alias module:model/InfoFromBuyer
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>InfoFromBuyer</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/InfoFromBuyer} obj Optional instance to populate.
    * @return {module:model/InfoFromBuyer} The populated <code>InfoFromBuyer</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new InfoFromBuyer();
                        
            
            if (data.hasOwnProperty('note')) {
                obj['note'] = ApiClient.convertToType(data['note'], 'String');
            }
            if (data.hasOwnProperty('returnShipmentTracking')) {
                obj['returnShipmentTracking'] = ApiClient.convertToType(data['returnShipmentTracking'], [TrackingInfo]);
            }
        }
        return obj;
    }

    /**
    * This field shows any note that was left by the buyer for in regards to the dispute.
    * @member {String} note
    */
    'note' = undefined;
    /**
    * This array shows shipment tracking information for one or more shipping packages being returned to the buyer after a payment dispute.
    * @member {Array.<module:model/TrackingInfo>} returnShipmentTracking
    */
    'returnShipmentTracking' = undefined;




}
