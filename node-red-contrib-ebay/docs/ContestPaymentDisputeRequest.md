# FulfillmentApi.ContestPaymentDisputeRequest

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**returnAddress** | [**ReturnAddress**](ReturnAddress.md) |  | [optional] 
**revision** | **Number** | This integer value indicates the revision number of the payment dispute. This field is required. The current revision number for a payment dispute can be retrieved with the getPaymentDispute method. Each time an action is taken against a payment dispute, this integer value increases by 1. | [optional] 
