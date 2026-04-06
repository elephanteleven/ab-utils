<a name="module.exports"></a>

## module.exports
This will be used to create the default healthcheck request handler for
each AB service. It can be overridden by manually adding a *.healthcheck 
handler to the service.

**Kind**: static class of <code>module</code>  

* [.exports](./module.md#module.exports)
    * [new module.exports(serviceName)](./new_module.md#new_module.exports_new)
    * [.fn(req, cb)](./module.md#module.exports+fn)

<a name="new_module.exports_new"></a>

### new module.exports(serviceName)

| Param | Type | Description |
| --- | --- | --- |
| serviceName | <code>string</code> | The name/key of the service. |

<a name="module.exports+fn"></a>

### exports.fn(req, cb)
the Request handler.

**Kind**: instance method of [<code>exports</code>](./module.md#module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>obj</code> |  |
| cb | <code>fn</code> | a node style callback(err, results) to send data when job is finished |

