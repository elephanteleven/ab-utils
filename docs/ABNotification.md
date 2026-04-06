<a name="ABNotification"></a>

## ABNotification
**Kind**: global class  

* [ABNotification](#ABNotification)
    * [new ABNotification(req)](#new_ABNotification_new)
    * [.notify(domain, error, [info])](#ABNotification+notify)

<a name="new_ABNotification_new"></a>

### new ABNotification(req)

| Param | Type |
| --- | --- |
| req | <code>object</code> | 

<a name="ABNotification+notify"></a>

### abNotification.notify(domain, error, [info])
**Kind**: instance method of [<code>ABNotification</code>](#ABNotification)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| domain | <code>string</code> |  | Normally "builder" or "developer" |
| error | <code>Error</code> \| <code>Array.&lt;Error&gt;</code> \| <code>string</code> \| <code>object</code> |  |  |
| [info] | <code>object</code> | <code>{}</code> |  |

