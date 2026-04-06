<a name="ABResponseAPI"></a>

## ABResponseAPI
**Kind**: global class  

* [ABResponseAPI](#ABResponseAPI)
    * [new ABResponseAPI(req, res)](#new_ABResponseAPI_new)
    * [.error(error, [code])](#ABResponseAPI+error)
    * [.reauth()](#ABResponseAPI+reauth)
    * [.success(data, [code], [skipHeaders])](#ABResponseAPI+success)

<a name="new_ABResponseAPI_new"></a>

### new ABResponseAPI(req, res)

| Param | Type |
| --- | --- |
| req | <code>object</code> | 
| res | <code>object</code> | 

<a name="ABResponseAPI+error"></a>

### res.error(error, [code])
send an error

**Kind**: instance method of [<code>ABResponseAPI</code>](#ABResponseAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| error | <code>Error</code> |  |  |
| [code] | <code>number</code> \| <code>string</code> | <code>400</code> | response code |

<a name="ABResponseAPI+reauth"></a>

### res.reauth()
send 401 with a Reauthenticate message

**Kind**: instance method of [<code>ABResponseAPI</code>](#ABResponseAPI)  
<a name="ABResponseAPI+success"></a>

### res.success(data, [code], [skipHeaders])
send a success message with data

**Kind**: instance method of [<code>ABResponseAPI</code>](#ABResponseAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>object</code> |  |  |
| [code] | <code>number</code> | <code>200</code> | http response code |
| [skipHeaders] | <code>boolean</code> | <code>false</code> |  |

