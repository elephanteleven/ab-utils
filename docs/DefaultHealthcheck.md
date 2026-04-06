<a name="module_utils/defaultHealthcheck..DefaultHealthcheck"></a>

## utils/defaultHealthcheck~DefaultHealthcheck
**Kind**: inner class of <code>module:utils/defaultHealthcheck</code>  

* [~DefaultHealthcheck](./module_utils/defaultHealthcheck.md#module_utils/defaultHealthcheck..DefaultHealthcheck)
    * [new DefaultHealthcheck(serviceName)](./new_module_utils/defaultHealthcheck.md#new_module_utils/defaultHealthcheck..DefaultHealthcheck_new)
    * [.fn(req, cb)](./module_utils/defaultHealthcheck.md#module_utils/defaultHealthcheck..DefaultHealthcheck+fn)

<a name="new_module_utils/defaultHealthcheck..DefaultHealthcheck_new"></a>

### new DefaultHealthcheck(serviceName)

| Param | Type | Description |
| --- | --- | --- |
| serviceName | <code>string</code> | The name/key of the service. |

<a name="module_utils/defaultHealthcheck..DefaultHealthcheck+fn"></a>

### defaultHealthcheck.fn(req, cb)
the Request handler.

**Kind**: instance method of [<code>DefaultHealthcheck</code>](./module_utils/defaultHealthcheck.md#module_utils/defaultHealthcheck..DefaultHealthcheck)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>obj</code> |  |
| cb | <code>fn</code> | a node style callback(err, results) to send data when job is finished |

