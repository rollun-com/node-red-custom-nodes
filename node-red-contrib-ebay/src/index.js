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

import ApiClient from './ApiClient';
import AcceptPaymentDisputeRequest from './model/AcceptPaymentDisputeRequest';
import AddEvidencePaymentDisputeRequest from './model/AddEvidencePaymentDisputeRequest';
import AddEvidencePaymentDisputeResponse from './model/AddEvidencePaymentDisputeResponse';
import Address from './model/Address';
import Amount from './model/Amount';
import AppliedPromotion from './model/AppliedPromotion';
import Buyer from './model/Buyer';
import CancelRequest from './model/CancelRequest';
import CancelStatus from './model/CancelStatus';
import ContestPaymentDisputeRequest from './model/ContestPaymentDisputeRequest';
import DeliveryCost from './model/DeliveryCost';
import DisputeEvidence from './model/DisputeEvidence';
import DisputeSummaryResponse from './model/DisputeSummaryResponse';
import EbayCollectAndRemitTax from './model/EbayCollectAndRemitTax';
import Error from './model/Error';
import ErrorParameter from './model/ErrorParameter';
import EvidenceRequest from './model/EvidenceRequest';
import ExtendedContact from './model/ExtendedContact';
import FileEvidence from './model/FileEvidence';
import FileInfo from './model/FileInfo';
import FulfillmentStartInstruction from './model/FulfillmentStartInstruction';
import GiftDetails from './model/GiftDetails';
import InfoFromBuyer from './model/InfoFromBuyer';
import IssueRefundRequest from './model/IssueRefundRequest';
import LegacyReference from './model/LegacyReference';
import LineItem from './model/LineItem';
import LineItemFulfillmentInstructions from './model/LineItemFulfillmentInstructions';
import LineItemProperties from './model/LineItemProperties';
import LineItemReference from './model/LineItemReference';
import LineItemRefund from './model/LineItemRefund';
import Order from './model/Order';
import OrderLineItems from './model/OrderLineItems';
import OrderRefund from './model/OrderRefund';
import OrderSearchPagedCollection from './model/OrderSearchPagedCollection';
import Payment from './model/Payment';
import PaymentDispute from './model/PaymentDispute';
import PaymentDisputeActivity from './model/PaymentDisputeActivity';
import PaymentDisputeActivityHistory from './model/PaymentDisputeActivityHistory';
import PaymentDisputeOutcomeDetail from './model/PaymentDisputeOutcomeDetail';
import PaymentDisputeSummary from './model/PaymentDisputeSummary';
import PaymentHold from './model/PaymentHold';
import PaymentSummary from './model/PaymentSummary';
import Phone from './model/Phone';
import PhoneNumber from './model/PhoneNumber';
import PickupStep from './model/PickupStep';
import PostSaleAuthenticationProgram from './model/PostSaleAuthenticationProgram';
import PricingSummary from './model/PricingSummary';
import Program from './model/Program';
import Refund from './model/Refund';
import RefundItem from './model/RefundItem';
import ReturnAddress from './model/ReturnAddress';
import SellerActionsToRelease from './model/SellerActionsToRelease';
import ShippingFulfillment from './model/ShippingFulfillment';
import ShippingFulfillmentDetails from './model/ShippingFulfillmentDetails';
import ShippingFulfillmentPagedCollection from './model/ShippingFulfillmentPagedCollection';
import ShippingStep from './model/ShippingStep';
import SimpleAmount from './model/SimpleAmount';
import Tax from './model/Tax';
import TaxIdentifier from './model/TaxIdentifier';
import TrackingInfo from './model/TrackingInfo';
import UpdateEvidencePaymentDisputeRequest from './model/UpdateEvidencePaymentDisputeRequest';
import OrderApi from './api/OrderApi';
import PaymentDisputeApi from './api/PaymentDisputeApi';
import ShippingFulfillmentApi from './api/ShippingFulfillmentApi';

/**
* Use_the_Fulfillment_API_to_complete_the_process_of_packaging_addressing_handling_and_shipping_each_order_on_behalf_of_the_seller_in_accordance_with_the_payment_method_and_timing_specified_at_checkout_.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var FulfillmentApi = require('index'); // See note below*.
* var xxxSvc = new FulfillmentApi.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new FulfillmentApi.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new FulfillmentApi.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new FulfillmentApi.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version v1.17.0
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The AcceptPaymentDisputeRequest model constructor.
     * @property {module:model/AcceptPaymentDisputeRequest}
     */
    AcceptPaymentDisputeRequest,

    /**
     * The AddEvidencePaymentDisputeRequest model constructor.
     * @property {module:model/AddEvidencePaymentDisputeRequest}
     */
    AddEvidencePaymentDisputeRequest,

    /**
     * The AddEvidencePaymentDisputeResponse model constructor.
     * @property {module:model/AddEvidencePaymentDisputeResponse}
     */
    AddEvidencePaymentDisputeResponse,

    /**
     * The Address model constructor.
     * @property {module:model/Address}
     */
    Address,

    /**
     * The Amount model constructor.
     * @property {module:model/Amount}
     */
    Amount,

    /**
     * The AppliedPromotion model constructor.
     * @property {module:model/AppliedPromotion}
     */
    AppliedPromotion,

    /**
     * The Buyer model constructor.
     * @property {module:model/Buyer}
     */
    Buyer,

    /**
     * The CancelRequest model constructor.
     * @property {module:model/CancelRequest}
     */
    CancelRequest,

    /**
     * The CancelStatus model constructor.
     * @property {module:model/CancelStatus}
     */
    CancelStatus,

    /**
     * The ContestPaymentDisputeRequest model constructor.
     * @property {module:model/ContestPaymentDisputeRequest}
     */
    ContestPaymentDisputeRequest,

    /**
     * The DeliveryCost model constructor.
     * @property {module:model/DeliveryCost}
     */
    DeliveryCost,

    /**
     * The DisputeEvidence model constructor.
     * @property {module:model/DisputeEvidence}
     */
    DisputeEvidence,

    /**
     * The DisputeSummaryResponse model constructor.
     * @property {module:model/DisputeSummaryResponse}
     */
    DisputeSummaryResponse,

    /**
     * The EbayCollectAndRemitTax model constructor.
     * @property {module:model/EbayCollectAndRemitTax}
     */
    EbayCollectAndRemitTax,

    /**
     * The Error model constructor.
     * @property {module:model/Error}
     */
    Error,

    /**
     * The ErrorParameter model constructor.
     * @property {module:model/ErrorParameter}
     */
    ErrorParameter,

    /**
     * The EvidenceRequest model constructor.
     * @property {module:model/EvidenceRequest}
     */
    EvidenceRequest,

    /**
     * The ExtendedContact model constructor.
     * @property {module:model/ExtendedContact}
     */
    ExtendedContact,

    /**
     * The FileEvidence model constructor.
     * @property {module:model/FileEvidence}
     */
    FileEvidence,

    /**
     * The FileInfo model constructor.
     * @property {module:model/FileInfo}
     */
    FileInfo,

    /**
     * The FulfillmentStartInstruction model constructor.
     * @property {module:model/FulfillmentStartInstruction}
     */
    FulfillmentStartInstruction,

    /**
     * The GiftDetails model constructor.
     * @property {module:model/GiftDetails}
     */
    GiftDetails,

    /**
     * The InfoFromBuyer model constructor.
     * @property {module:model/InfoFromBuyer}
     */
    InfoFromBuyer,

    /**
     * The IssueRefundRequest model constructor.
     * @property {module:model/IssueRefundRequest}
     */
    IssueRefundRequest,

    /**
     * The LegacyReference model constructor.
     * @property {module:model/LegacyReference}
     */
    LegacyReference,

    /**
     * The LineItem model constructor.
     * @property {module:model/LineItem}
     */
    LineItem,

    /**
     * The LineItemFulfillmentInstructions model constructor.
     * @property {module:model/LineItemFulfillmentInstructions}
     */
    LineItemFulfillmentInstructions,

    /**
     * The LineItemProperties model constructor.
     * @property {module:model/LineItemProperties}
     */
    LineItemProperties,

    /**
     * The LineItemReference model constructor.
     * @property {module:model/LineItemReference}
     */
    LineItemReference,

    /**
     * The LineItemRefund model constructor.
     * @property {module:model/LineItemRefund}
     */
    LineItemRefund,

    /**
     * The Order model constructor.
     * @property {module:model/Order}
     */
    Order,

    /**
     * The OrderLineItems model constructor.
     * @property {module:model/OrderLineItems}
     */
    OrderLineItems,

    /**
     * The OrderRefund model constructor.
     * @property {module:model/OrderRefund}
     */
    OrderRefund,

    /**
     * The OrderSearchPagedCollection model constructor.
     * @property {module:model/OrderSearchPagedCollection}
     */
    OrderSearchPagedCollection,

    /**
     * The Payment model constructor.
     * @property {module:model/Payment}
     */
    Payment,

    /**
     * The PaymentDispute model constructor.
     * @property {module:model/PaymentDispute}
     */
    PaymentDispute,

    /**
     * The PaymentDisputeActivity model constructor.
     * @property {module:model/PaymentDisputeActivity}
     */
    PaymentDisputeActivity,

    /**
     * The PaymentDisputeActivityHistory model constructor.
     * @property {module:model/PaymentDisputeActivityHistory}
     */
    PaymentDisputeActivityHistory,

    /**
     * The PaymentDisputeOutcomeDetail model constructor.
     * @property {module:model/PaymentDisputeOutcomeDetail}
     */
    PaymentDisputeOutcomeDetail,

    /**
     * The PaymentDisputeSummary model constructor.
     * @property {module:model/PaymentDisputeSummary}
     */
    PaymentDisputeSummary,

    /**
     * The PaymentHold model constructor.
     * @property {module:model/PaymentHold}
     */
    PaymentHold,

    /**
     * The PaymentSummary model constructor.
     * @property {module:model/PaymentSummary}
     */
    PaymentSummary,

    /**
     * The Phone model constructor.
     * @property {module:model/Phone}
     */
    Phone,

    /**
     * The PhoneNumber model constructor.
     * @property {module:model/PhoneNumber}
     */
    PhoneNumber,

    /**
     * The PickupStep model constructor.
     * @property {module:model/PickupStep}
     */
    PickupStep,

    /**
     * The PostSaleAuthenticationProgram model constructor.
     * @property {module:model/PostSaleAuthenticationProgram}
     */
    PostSaleAuthenticationProgram,

    /**
     * The PricingSummary model constructor.
     * @property {module:model/PricingSummary}
     */
    PricingSummary,

    /**
     * The Program model constructor.
     * @property {module:model/Program}
     */
    Program,

    /**
     * The Refund model constructor.
     * @property {module:model/Refund}
     */
    Refund,

    /**
     * The RefundItem model constructor.
     * @property {module:model/RefundItem}
     */
    RefundItem,

    /**
     * The ReturnAddress model constructor.
     * @property {module:model/ReturnAddress}
     */
    ReturnAddress,

    /**
     * The SellerActionsToRelease model constructor.
     * @property {module:model/SellerActionsToRelease}
     */
    SellerActionsToRelease,

    /**
     * The ShippingFulfillment model constructor.
     * @property {module:model/ShippingFulfillment}
     */
    ShippingFulfillment,

    /**
     * The ShippingFulfillmentDetails model constructor.
     * @property {module:model/ShippingFulfillmentDetails}
     */
    ShippingFulfillmentDetails,

    /**
     * The ShippingFulfillmentPagedCollection model constructor.
     * @property {module:model/ShippingFulfillmentPagedCollection}
     */
    ShippingFulfillmentPagedCollection,

    /**
     * The ShippingStep model constructor.
     * @property {module:model/ShippingStep}
     */
    ShippingStep,

    /**
     * The SimpleAmount model constructor.
     * @property {module:model/SimpleAmount}
     */
    SimpleAmount,

    /**
     * The Tax model constructor.
     * @property {module:model/Tax}
     */
    Tax,

    /**
     * The TaxIdentifier model constructor.
     * @property {module:model/TaxIdentifier}
     */
    TaxIdentifier,

    /**
     * The TrackingInfo model constructor.
     * @property {module:model/TrackingInfo}
     */
    TrackingInfo,

    /**
     * The UpdateEvidencePaymentDisputeRequest model constructor.
     * @property {module:model/UpdateEvidencePaymentDisputeRequest}
     */
    UpdateEvidencePaymentDisputeRequest,

    /**
    * The OrderApi service constructor.
    * @property {module:api/OrderApi}
    */
    OrderApi,

    /**
    * The PaymentDisputeApi service constructor.
    * @property {module:api/PaymentDisputeApi}
    */
    PaymentDisputeApi,

    /**
    * The ShippingFulfillmentApi service constructor.
    * @property {module:api/ShippingFulfillmentApi}
    */
    ShippingFulfillmentApi
};
