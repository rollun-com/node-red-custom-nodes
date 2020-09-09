# FulfillmentApi.CancelStatus

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**cancelledDate** | **String** | The date and time the order was cancelled, if applicable. This timestamp is in ISO 8601 format, which uses the 24-hour Universal Coordinated Time (UTC) clock. Format: [YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].[sss]Z Example: 2015-08-04T19:09:02.768Z | [optional] 
**cancelRequests** | [**[CancelRequest]**](CancelRequest.md) | This array contains details of one or more buyer requests to cancel the order. For the getOrders call: This array is returned but is always empty. For the getOrder call: This array is returned fully populated with information about any cancellation requests. | [optional] 
**cancelState** | **String** | The state of the order with regard to cancellation. This field is always returned, and if there are no cancellation requests, a value of NONE_REQUESTED is returned. For implementation help, refer to &lt;a href&#x3D;&#x27;https://developer.ebay.com/api-docs/sell/fulfillment/types/sel:CancelStateEnum&#x27;&gt;eBay API documentation&lt;/a&gt; | [optional] 
