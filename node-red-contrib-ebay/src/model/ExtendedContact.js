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
import Address from './Address';
import PhoneNumber from './PhoneNumber';

/**
* The ExtendedContact model module.
* @module model/ExtendedContact
* @version v1.17.0
*/
export default class ExtendedContact {
    /**
    * Constructs a new <code>ExtendedContact</code>.
    * This type contains shipping and contact information for a buyer or an eBay shipping partner.
    * @alias module:model/ExtendedContact
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>ExtendedContact</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/ExtendedContact} obj Optional instance to populate.
    * @return {module:model/ExtendedContact} The populated <code>ExtendedContact</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ExtendedContact();
                        
            
            if (data.hasOwnProperty('companyName')) {
                obj['companyName'] = ApiClient.convertToType(data['companyName'], 'String');
            }
            if (data.hasOwnProperty('contactAddress')) {
                obj['contactAddress'] = Address.constructFromObject(data['contactAddress']);
            }
            if (data.hasOwnProperty('email')) {
                obj['email'] = ApiClient.convertToType(data['email'], 'String');
            }
            if (data.hasOwnProperty('fullName')) {
                obj['fullName'] = ApiClient.convertToType(data['fullName'], 'String');
            }
            if (data.hasOwnProperty('primaryPhone')) {
                obj['primaryPhone'] = PhoneNumber.constructFromObject(data['primaryPhone']);
            }
        }
        return obj;
    }

    /**
    * The company name associated with the buyer or eBay shipping partner. This field is only returned if defined/applicable to the buyer or eBay shipping partner.
    * @member {String} companyName
    */
    'companyName' = undefined;
    /**
    * @member {module:model/Address} contactAddress
    */
    'contactAddress' = undefined;
    /**
    * This field shows the email address of the buyer. The email address of a buyer will be masked 14 days after order creation. This field will still be returned for the order, but it will not contain the buyer's email address, but instead, something like 'Invalid Request'. Note: This field always contains the email address of the buyer even with a Global Shipping Program shipment.
    * @member {String} email
    */
    'email' = undefined;
    /**
    * The full name of the buyer or eBay shipping partner.
    * @member {String} fullName
    */
    'fullName' = undefined;
    /**
    * @member {module:model/PhoneNumber} primaryPhone
    */
    'primaryPhone' = undefined;




}