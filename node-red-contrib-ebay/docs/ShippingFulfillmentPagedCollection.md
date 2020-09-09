# FulfillmentApi.ShippingFulfillmentPagedCollection

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fulfillments** | [**[ShippingFulfillment]**](ShippingFulfillment.md) | This array contains one or more fulfillments required for the order that was specified in method endpoint. | [optional] 
**total** | **Number** | The total number of fulfillments in the specified order. Note: If no fulfillments are found for the order, this field is returned with a value of 0. | [optional] 
**warnings** | [**[Error]**](Error.md) | This array is only returned if one or more errors or warnings occur with the call request. | [optional] 
