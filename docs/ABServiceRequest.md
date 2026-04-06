<a name="ABServiceRequest"></a>

## ABServiceRequest ⇐ [<code>ABServiceCote</code>](./ABServiceCote.md#ABServiceCote)
**Kind**: global class  
**Extends**: [<code>ABServiceCote</code>](./ABServiceCote.md#ABServiceCote)  

* [ABServiceRequest](#ABServiceRequest) ⇐ [<code>ABServiceCote</code>](./ABServiceCote.md#ABServiceCote)
    * [.request(key, data, [options], [cb])](#ABServiceRequest+request) ⇒ <code>Promise</code>
    * [.getRequester(domain, long)](#ABServiceRequest+getRequester)
    * [.toParam(key, data)](./ABServiceCote.md#ABServiceCote+toParam)

<a name="ABServiceRequest+request"></a>

### abServiceRequest.request(key, data, [options], [cb]) ⇒ <code>Promise</code>
Send a request to another micro-service using the cote protocol. Accept an
optional callback, but also returns a promise.

**Kind**: instance method of [<code>ABServiceRequest</code>](#ABServiceRequest)  
**Returns**: <code>Promise</code> - resolves with the response from the service  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  | the service handler's key we are sending a request to. |
| data | <code>json</code> |  | the data packet to send to the service. |
| [options] | <code>object</code> |  | optional options |
| [options.timeout] | <code>number</code> | <code>5000</code> | ms to wait before timing out |
| [options.maxAttempts] | <code>number</code> | <code>5</code> | how many times to try the request if  it fails |
| [options.longRequest] | <code>boolean</code> | <code>false</code> | timeout after 90 seconds, will be ignored if timeout was set |
| [options.stringResult] | <code>boolean</code> | <code>false</code> | Return the results as a string data type. |
| [cb] | <code>function</code> |  | optional node.js style callback(err, result) for when the response is received. |

**Example**  
```js
// async/await
try {
   let result = await request(key, data);
} catch (err) {}
// promise
request(key, data, opts).then((result) => {}).catch((err) => {})
// callback
request(key, data, opts, (err, result) => {})
// or
request(key, data, (err, result) => {})
```
<a name="ABServiceRequest+getRequester"></a>

### abServiceRequest.getRequester(domain, long)
Gets a cached requester for the domain, creating one if needed

**Kind**: instance method of [<code>ABServiceRequest</code>](#ABServiceRequest)  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>string</code> | cote domain key |
| long | <code>boolean</code> | whether the requester needs a longer timeout |

<a name="ABServiceCote+toParam"></a>

### abServiceRequest.toParam(key, data)
toParam()
repackage the current data into a common format between our services

**Kind**: instance method of [<code>ABServiceRequest</code>](#ABServiceRequest)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The cote request key that identifies which service we are sending 			our request to. |
| data | <code>json</code> | The data packet we are providing to the service. |

