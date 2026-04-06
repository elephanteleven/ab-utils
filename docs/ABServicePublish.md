<a name="ABServicePublish"></a>

## ABServicePublish ⇐ [<code>ABServiceCote</code>](./ABServiceCote.md#ABServiceCote)
**Kind**: global class  
**Extends**: [<code>ABServiceCote</code>](./ABServiceCote.md#ABServiceCote)  

* [ABServicePublish](#ABServicePublish) ⇐ [<code>ABServiceCote</code>](./ABServiceCote.md#ABServiceCote)
    * [.publish(key, data)](#ABServicePublish+publish)
    * [.toParam(key, data)](./ABServiceCote.md#ABServiceCote+toParam)

<a name="ABServicePublish+publish"></a>

### abServicePublish.publish(key, data)
Publish an update to other subscribed services.

**Kind**: instance method of [<code>ABServicePublish</code>](#ABServicePublish)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the channel we are updating. |
| data | <code>json</code> | the data packet to send to the subscribers. |

<a name="ABServiceCote+toParam"></a>

### abServicePublish.toParam(key, data)
toParam()
repackage the current data into a common format between our services

**Kind**: instance method of [<code>ABServicePublish</code>](#ABServicePublish)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The cote request key that identifies which service we are sending 			our request to. |
| data | <code>json</code> | The data packet we are providing to the service. |

