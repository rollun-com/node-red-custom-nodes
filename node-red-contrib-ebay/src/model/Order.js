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
import Buyer from './Buyer';
import CancelStatus from './CancelStatus';
import FulfillmentStartInstruction from './FulfillmentStartInstruction';
import LineItem from './LineItem';
import PaymentSummary from './PaymentSummary';
import PricingSummary from './PricingSummary';
import Program from './Program';

/**
* The Order model module.
* @module model/Order
* @version v1.17.0
*/
export default class Order {
    /**
    * Constructs a new <code>Order</code>.
    * This type contains the details of an order, including information about the buyer, order history, shipping fulfillments, line items, costs, payments, and order fulfillment status.
    * @alias module:model/Order
    * @class
    */

    constructor() {
        
        
        
    }

    /**
    * Constructs a <code>Order</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/Order} obj Optional instance to populate.
    * @return {module:model/Order} The populated <code>Order</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Order();
                        
            
            if (data.hasOwnProperty('buyer')) {
                obj['buyer'] = Buyer.constructFromObject(data['buyer']);
            }
            if (data.hasOwnProperty('buyerCheckoutNotes')) {
                obj['buyerCheckoutNotes'] = ApiClient.convertToType(data['buyerCheckoutNotes'], 'String');
            }
            if (data.hasOwnProperty('cancelStatus')) {
                obj['cancelStatus'] = CancelStatus.constructFromObject(data['cancelStatus']);
            }
            if (data.hasOwnProperty('creationDate')) {
                obj['creationDate'] = ApiClient.convertToType(data['creationDate'], 'String');
            }
            if (data.hasOwnProperty('ebayCollectAndRemitTax')) {
                obj['ebayCollectAndRemitTax'] = ApiClient.convertToType(data['ebayCollectAndRemitTax'], 'Boolean');
            }
            if (data.hasOwnProperty('fulfillmentHrefs')) {
                obj['fulfillmentHrefs'] = ApiClient.convertToType(data['fulfillmentHrefs'], ['String']);
            }
            if (data.hasOwnProperty('fulfillmentStartInstructions')) {
                obj['fulfillmentStartInstructions'] = ApiClient.convertToType(data['fulfillmentStartInstructions'], [FulfillmentStartInstruction]);
            }
            if (data.hasOwnProperty('lastModifiedDate')) {
                obj['lastModifiedDate'] = ApiClient.convertToType(data['lastModifiedDate'], 'String');
            }
            if (data.hasOwnProperty('legacyOrderId')) {
                obj['legacyOrderId'] = ApiClient.convertToType(data['legacyOrderId'], 'String');
            }
            if (data.hasOwnProperty('lineItems')) {
                obj['lineItems'] = ApiClient.convertToType(data['lineItems'], [LineItem]);
            }
            if (data.hasOwnProperty('orderFulfillmentStatus')) {
                obj['orderFulfillmentStatus'] = ApiClient.convertToType(data['orderFulfillmentStatus'], 'String');
            }
            if (data.hasOwnProperty('orderId')) {
                obj['orderId'] = ApiClient.convertToType(data['orderId'], 'String');
            }
            if (data.hasOwnProperty('orderPaymentStatus')) {
                obj['orderPaymentStatus'] = ApiClient.convertToType(data['orderPaymentStatus'], 'String');
            }
            if (data.hasOwnProperty('paymentSummary')) {
                obj['paymentSummary'] = PaymentSummary.constructFromObject(data['paymentSummary']);
            }
            if (data.hasOwnProperty('pricingSummary')) {
                obj['pricingSummary'] = PricingSummary.constructFromObject(data['pricingSummary']);
            }
            if (data.hasOwnProperty('program')) {
                obj['program'] = Program.constructFromObject(data['program']);
            }
            if (data.hasOwnProperty('salesRecordReference')) {
                obj['salesRecordReference'] = ApiClient.convertToType(data['salesRecordReference'], 'String');
            }
            if (data.hasOwnProperty('sellerId')) {
                obj['sellerId'] = ApiClient.convertToType(data['sellerId'], 'String');
            }
            if (data.hasOwnProperty('totalFeeBasisAmount')) {
                obj['totalFeeBasisAmount'] = Amount.constructFromObject(data['totalFeeBasisAmount']);
            }
        }
        return obj;
    }

    /**
    * @member {module:model/Buyer} buyer
    */
    'buyer' = undefined;
    /**
    * This field contains any comments that the buyer left for the seller about the order during checkout process. This field is only returned if a buyer left comments at checkout time.
    * @member {String} buyerCheckoutNotes
    */
    'buyerCheckoutNotes' = undefined;
    /**
    * @member {module:model/CancelStatus} cancelStatus
    */
    'cancelStatus' = undefined;
    /**
    * The date and time that the order was created. This timestamp is in ISO 8601 format, which uses the 24-hour Universal Coordinated Time (UTC) clock. Format: [YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].[sss]Z Example: 2015-08-04T19:09:02.768Z
    * @member {String} creationDate
    */
    'creationDate' = undefined;
    /**
    * This field is only returned if true, and indicates that eBay will collect tax (US state-mandates sales tax or 'goods and services' tax in Australia or New Zealand) for at least one line item in the order, and remit the tax to the taxing authority of the buyer's residence. If this field is returned, the seller should search for one or more ebayCollectAndRemitTaxes containers at the line item level to get more information about the type of tax and the amount.
    * @member {Boolean} ebayCollectAndRemitTax
    */
    'ebayCollectAndRemitTax' = undefined;
    /**
    * This array contains a list of one or more getShippingFulfillment call URIs that can be used to retrieve shipping fulfillments that have been set up for the order.
    * @member {Array.<String>} fulfillmentHrefs
    */
    'fulfillmentHrefs' = undefined;
    /**
    * This container consists of a set of specifications for fulfilling the order, including the type of fulfillment, shipping carrier and service, shipping address, and estimated delivery window. These instructions are derived from the buyer's and seller's eBay account preferences, the listing parameters, and the buyer's checkout selections. The seller can use them as a starting point for packaging, addressing, and shipping the order. Note: Although this container is presented as an array, it currently returns only one set of fulfillment specifications. Additional array members will be supported in future functionality.
    * @member {Array.<module:model/FulfillmentStartInstruction>} fulfillmentStartInstructions
    */
    'fulfillmentStartInstructions' = undefined;
    /**
    * The date and time that the order was last modified. This timestamp is in ISO 8601 format, which uses the 24-hour Universal Coordinated Time (UTC) clock. Format: [YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].[sss]Z Example: 2015-08-04T19:09:02.768Z
    * @member {String} lastModifiedDate
    */
    'lastModifiedDate' = undefined;
    /**
    * The unique identifier of the order in legacy format, as traditionally used by the Trading API (and other legacy APIs). Both the orderId field and this field are always returned. Note: In June 2019, Order IDs in REST APIs transitioned to a new format. For the Trading and other legacy APIs, by using version control/compatibility level, users have the option of using the older legacy order ID format, or they can migrate to the new order ID format, which is the same order ID format being used by REST APIs. Although users of the Trading API (and other legacy APIs) can now transition to the new order ID format, this legacyOrderId field will still return order IDs in the old format to distinguish between the old and new order IDs.
    * @member {String} legacyOrderId
    */
    'legacyOrderId' = undefined;
    /**
    * This array contains the details for all line items that comprise the order.
    * @member {Array.<module:model/LineItem>} lineItems
    */
    'lineItems' = undefined;
    /**
    * The degree to which fulfillment of the order is complete. See the OrderFulfillmentStatus type definition for more information about each possible fulfillment state. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/sell/fulfillment/types/sel:OrderFulfillmentStatus'>eBay API documentation</a>
    * @member {String} orderFulfillmentStatus
    */
    'orderFulfillmentStatus' = undefined;
    /**
    * The unique identifier of the order. Both the legacyOrderId field (traditionally used by Trading and other legacy APIS) and this field are always returned. Note: In June 2019, Order IDs in REST APIs transitioned to a new format. For the Trading and other legacy APIs, by using version control/compatibility level, users have the option of using the older legacy order ID format, or they can migrate to the new order ID format, which is the same order ID format being used by REST APIs. The new format is a non-parsable string, globally unique across all eBay marketplaces, and consistent for both single line item and multiple line item orders. These order identifiers are automatically generated after buyer payment, and unlike in the past, instead of just being known and exposed to the seller, these unique order identifiers will also be known and used/referenced by the buyer and eBay customer support.
    * @member {String} orderId
    */
    'orderId' = undefined;
    /**
    * The enumeration value returned in this field indicates the current payment status of an order, or in case of a refund request, the current status of the refund. See the OrderPaymentStatusEnum type definition for more information about each possible payment/refund state. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/sell/fulfillment/types/sel:OrderPaymentStatusEnum'>eBay API documentation</a>
    * @member {String} orderPaymentStatus
    */
    'orderPaymentStatus' = undefined;
    /**
    * @member {module:model/PaymentSummary} paymentSummary
    */
    'paymentSummary' = undefined;
    /**
    * @member {module:model/PricingSummary} pricingSummary
    */
    'pricingSummary' = undefined;
    /**
    * @member {module:model/Program} program
    */
    'program' = undefined;
    /**
    * An eBay-generated identifier that is used to identify and manage orders through the Selling Manager and Selling Manager Pro tools. This order identifier can also be found on the Orders grid page and in the Sales Record pages in Seller Hub. A salesRecordReference number is only generated and returned at the order level, and not at the order line item level. In cases where the seller does not have a Selling Manager or Selling Manager Pro subscription nor access to Seller Hub, this field may not be returned.
    * @member {String} salesRecordReference
    */
    'salesRecordReference' = undefined;
    /**
    * The unique eBay user ID of the seller who sold the order.
    * @member {String} sellerId
    */
    'sellerId' = undefined;
    /**
    * @member {module:model/Amount} totalFeeBasisAmount
    */
    'totalFeeBasisAmount' = undefined;




}