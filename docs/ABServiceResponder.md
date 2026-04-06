<a name="ABServiceResponder"></a>

## ABServiceResponder
manage the responses to a ServiceRequest.

**Kind**: global class  
<a name="new_ABServiceResponder_new"></a>

### new ABServiceResponder(key, handler, req)

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the service handler's key we are responding to. |
| handler | <code>function</code> | a function to handle the incoming request. The function will receive 2 parameters: fn(req, cb) <br> req: an instance of the ABRequest appropriate for the current context. <br> cb:  a node.js style callback(err, result) for responding to the requester. |
| req | <code>object</code> |  |

