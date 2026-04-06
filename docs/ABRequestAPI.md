<a name="ABRequestAPI"></a>

## ABRequestAPI
a default set of data/utilities for our api request. This request
is established in the Sails api_sails service and is used to verify and send
jobs to various micro services.

**Kind**: global class  

* [ABRequestAPI](#ABRequestAPI)
    * [new ABRequestAPI(req, res, [config])](#new_ABRequestAPI_new)
    * [.tenantID](#ABRequestAPI+tenantID) : <code>string</code>
    * [.user](#ABRequestAPI+user) : <code>obj</code>
    * [.userReal](#ABRequestAPI+userReal) : <code>obj</code>
    * [.isSwitcherood()](#ABRequestAPI+isSwitcherood) ⇒ <code>boolean</code>
    * [.switcherooToUser(user)](#ABRequestAPI+switcherooToUser)
    * [.userDefaults()](#ABRequestAPI+userDefaults) ⇒ <code>obj</code>
    * [.tenantSet()](#ABRequestAPI+tenantSet) ⇒ <code>bool</code>
    * [.log(...args)](#ABRequestAPI+log)
    * [.param(key)](#ABRequestAPI+param) ⇒ <code>string</code>
    * [.serviceResponder(key, handler)](#ABRequestAPI+serviceResponder) ⇒ [<code>ABServiceResponder</code>](./ABServiceResponder.md#ABServiceResponder)
    * [.serviceSubscribe(key, handler)](#ABRequestAPI+serviceSubscribe) ⇒ [<code>ABServiceSubscriber</code>](./ABServiceSubscriber.md#ABServiceSubscriber)
    * [.socketKey(key)](#ABRequestAPI+socketKey) ⇒ <code>string</code>
    * [.spanCreateChild(key, attributes)](#ABRequestAPI+spanCreateChild) ⇒ <code>object</code>
    * [.spanRequest(key, attributes)](#ABRequestAPI+spanRequest) ⇒ <code>object</code>
    * [.spanEnd(key)](#ABRequestAPI+spanEnd)
    * [.validateParameters(description, [autoRespond], [params])](#ABRequestAPI+validateParameters) ⇒ <code>bool</code>
    * [.validationReset()](#ABRequestAPI+validationReset)
    * [.validRoles(roleIDs)](#ABRequestAPI+validRoles) ⇒ <code>bool</code>
    * [.validBuilder([autoRespond])](#ABRequestAPI+validBuilder) ⇒ <code>bool</code>
    * [.validSwitcheroo([autoRespond])](#ABRequestAPI+validSwitcheroo) ⇒ <code>bool</code>
    * [.validUser([autoRespond])](#ABRequestAPI+validUser) ⇒ <code>bool</code>
    * [.notify(domain, error, [info])](#ABRequestAPI+notify)
        * [.builder(error, [info])](#ABRequestAPI+notify.builder)
        * [.developer(error, [info])](#ABRequestAPI+notify.developer)
    * [.servicePublish(key, data)](#ABRequestAPI+servicePublish)
    * [.serviceRequest(key, data, [options], [cb])](#ABRequestAPI+serviceRequest) ⇒ <code>Promise</code>

<a name="new_ABRequestAPI_new"></a>

### new ABRequestAPI(req, res, [config])

| Param | Type | Default |
| --- | --- | --- |
| req | <code>Object</code> |  | 
| res | <code>Object</code> |  | 
| [config] | <code>Object</code> | <code>{}</code> | 

<a name="ABRequestAPI+tenantID"></a>

### req.tenantID : <code>string</code>
tenant's id

**Kind**: instance property of [<code>ABRequestAPI</code>](#ABRequestAPI)  
<a name="ABRequestAPI+user"></a>

### req.user : <code>obj</code>
ABUser

**Kind**: instance property of [<code>ABRequestAPI</code>](#ABRequestAPI)  
<a name="ABRequestAPI+userReal"></a>

### req.userReal : <code>obj</code>
The actual user when using Switcheroo

**Kind**: instance property of [<code>ABRequestAPI</code>](#ABRequestAPI)  
<a name="ABRequestAPI+isSwitcherood"></a>

### req.isSwitcherood() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
<a name="ABRequestAPI+switcherooToUser"></a>

### req.switcherooToUser(user)
allow the current user to impersonate the provided user.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type |
| --- | --- |
| user | <code>json:SiteUser</code> | 

<a name="ABRequestAPI+userDefaults"></a>

### req.userDefaults() ⇒ <code>obj</code>
return a data structure used by our ABModel.find() .create() .update()
.delete() operations that needs credentials for the current User
driving this request.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
**Returns**: <code>obj</code> - .languageCode: {string} the default language code of the user
         .usernam: {string} the .username of the user for Identification.  
<a name="ABRequestAPI+tenantSet"></a>

### req.tenantSet() ⇒ <code>bool</code>
**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
**Returns**: <code>bool</code> - value if the tenantID is set.  
<a name="ABRequestAPI+log"></a>

### req.log(...args)
format our output logs to include our jobID with our message.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | anything to log (will be stringified) |

<a name="ABRequestAPI+param"></a>

### req.param(key) ⇒ <code>string</code>
An interface to return the requested input value.
If that value has already been processed by our .validateParameters()
we pull that value from there.  Otherwise we ask the provided req object
for the value.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The identifying parameter key |

<a name="ABRequestAPI+serviceResponder"></a>

### req.serviceResponder(key, handler) ⇒ [<code>ABServiceResponder</code>](./ABServiceResponder.md#ABServiceResponder)
Create a Cote service responder that can parse our data interchange
format.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the service handler's key we are responding to. |
| handler | <code>function</code> | a function to handle the incoming request. See [ABServiceResponder](./ABServiceResponder.md#ABServiceResponder) constructor for details |

<a name="ABRequestAPI+serviceSubscribe"></a>

### req.serviceSubscribe(key, handler) ⇒ [<code>ABServiceSubscriber</code>](./ABServiceSubscriber.md#ABServiceSubscriber)
Create a Cote service subscriber that can parse our data interchange
format.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the service handler's key we are responding to. |
| handler | <code>function</code> | a function to handle the incoming request. See [ABServiceSubscriber](./ABServiceSubscriber.md#ABServiceSubscriber) constructor for details |

<a name="ABRequestAPI+socketKey"></a>

### req.socketKey(key) ⇒ <code>string</code>
make sure any socket related key is prefixed by our tenantID

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The socket key we are wanting to reference. |

<a name="ABRequestAPI+spanCreateChild"></a>

### req.spanCreateChild(key, attributes) ⇒ <code>object</code>
Creates a telemetry child span based on the active span

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
**Returns**: <code>object</code> - the span  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | identifier for the span |
| attributes | <code>object</code> | any data to add to the span |

<a name="ABRequestAPI+spanRequest"></a>

### req.spanRequest(key, attributes) ⇒ <code>object</code>
Creates or gets the telemetry span for the current Request

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
**Returns**: <code>object</code> - the span  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | identifier for the span |
| attributes | <code>object</code> | any data to add to the span |

<a name="ABRequestAPI+spanEnd"></a>

### req.spanEnd(key)
Ends the given telemetry span

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | identifier for the span |

<a name="ABRequestAPI+validateParameters"></a>

### req.validateParameters(description, [autoRespond], [params]) ⇒ <code>bool</code>
Parse the description object and determine if the current req instance
passes the tests provided.

Will first use the description to build a joi validator, and then evaluate
the parameters using it.

Any missed validation rules will be stored internally and an error can be
retrieved using .errorValidation().

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
**Returns**: <code>bool</code> - true if all checks pass, otherwise false.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| description | <code>hash</code> |  | An object hash describing the validation checks to use. At the top level the Hash is: { [paramName] : {ruleHash} } |
| [autoRespond] | <code>bool</code> | <code>true</code> | if true will auto respond on errors with res.ab.error() |
| [params] | <code>hash</code> |  | the parameters to evaluate in the format `{ "param" : {values} }` hash. If not provided, then will use `req.allParams()` to evaluate against all parameters. |

**Example** *( Each {ruleHash} follows this format: )*  
```js
       "parameterName" : {
          {joi.fn}  : true,  // performs: joi.{fn}();
           {joi.fn} : {
             {joi.fn1} : true,   // performs: joi.{fn}().{fn1}();
             {joi.fn2} : { options } // performs: joi.{fn}().{fn2}({options})
           }
           // examples:
           "required" : {bool},  // default = false

           // custom:
           "validate" : {fn} a function(value, {allValues hash}) that
                          returns { error:{null || {new Error("Error Message")} }, value: {normalize(value)}}
        }
```
<a name="ABRequestAPI+validationReset"></a>

### req.validationReset()
**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
**Depreciated**:   
<a name="ABRequestAPI+validRoles"></a>

### req.validRoles(roleIDs) ⇒ <code>bool</code>
Verify if the current user has one of the provided roleIDs assigned.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| roleIDs | <code>Array.&lt;string&gt;</code> | array containing the uuids of the roles to verify. |

<a name="ABRequestAPI+validBuilder"></a>

### req.validBuilder([autoRespond]) ⇒ <code>bool</code>
Verify if the current user has one of the default Builder Roles assigned

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [autoRespond] | <code>bool</code> | <code>true</code> | do we auto res.ab.error() on a negative result see [validUser](#ABRequestAPI+validUser). |

<a name="ABRequestAPI+validSwitcheroo"></a>

### req.validSwitcheroo([autoRespond]) ⇒ <code>bool</code>
Verify if the current user has the Switcheroo Role assigned

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [autoRespond] | <code>bool</code> | <code>true</code> | do we auto res.ab.error() on a negative result see [validUser](#ABRequestAPI+validUser). |

<a name="ABRequestAPI+validUser"></a>

### req.validUser([autoRespond]) ⇒ <code>bool</code>
returns `true` if there is a valid .user set on the request, otherwise
`false`

By default, this function will return a "E_REAUTH" error back as the
response.  If you want to externally handle this situation
then need to pass `false` for autoRespond.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [autoRespond] | <code>bool</code> | <code>true</code> | will auto respond on errors with the `res` object. |

<a name="ABRequestAPI+notify"></a>

### req.notify(domain, error, [info])
**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| domain | <code>string</code> |  | Normally "builder" or "developer" |
| error | <code>Error</code> \| <code>Array.&lt;Error&gt;</code> \| <code>string</code> \| <code>object</code> |  |  |
| [info] | <code>object</code> | <code>{}</code> |  |


* [.notify(domain, error, [info])](#ABRequestAPI+notify)
    * [.builder(error, [info])](#ABRequestAPI+notify.builder)
    * [.developer(error, [info])](#ABRequestAPI+notify.developer)

<a name="ABRequestAPI+notify.builder"></a>

#### notify.builder(error, [info])
A shortcut method for notifying builders of configuration errors.

**Kind**: static method of [<code>notify</code>](#ABRequestAPI+notify)  

| Param | Type | Default |
| --- | --- | --- |
| error | <code>Error</code> |  | 
| [info] | <code>object</code> | <code>{}</code> | 

<a name="ABRequestAPI+notify.developer"></a>

#### notify.developer(error, [info])
A shortcut method for notifying developer of operational errors.

**Kind**: static method of [<code>notify</code>](#ABRequestAPI+notify)  

| Param | Type | Default |
| --- | --- | --- |
| error | <code>Error</code> |  | 
| [info] | <code>object</code> | <code>{}</code> | 

<a name="ABRequestAPI+servicePublish"></a>

### req.servicePublish(key, data)
Publish an update to other subscribed services.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the channel we are updating. |
| data | <code>json</code> | the data packet to send to the subscribers. |

<a name="ABRequestAPI+serviceRequest"></a>

### req.serviceRequest(key, data, [options], [cb]) ⇒ <code>Promise</code>
Send a request to another micro-service using the cote protocol. Accept an
optional callback, but also returns a promise.

**Kind**: instance method of [<code>ABRequestAPI</code>](#ABRequestAPI)  
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
