<a name="ABServiceController"></a>

## ABServiceController ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ABServiceController](#ABServiceController) ⇐ <code>EventEmitter</code>
    * [new ABServiceController([key])](#new_ABServiceController_new)
    * [.exit()](#ABServiceController+exit) ⇒ <code>Promise</code>
    * [.init()](#ABServiceController+init) ⇒ <code>Promise</code>
    * [.afterShutdown(fn)](#ABServiceController+afterShutdown)
    * [.afterStartup(fn)](#ABServiceController+afterStartup)
    * [.beforeShutdown(fn)](#ABServiceController+beforeShutdown)
    * [.beforeStartup(fn)](#ABServiceController+beforeStartup)
    * [.ready()](#ABServiceController+ready)
    * [.requestObj(option)](#ABServiceController+requestObj) ⇒ [<code>ABRequestService</code>](./ABRequestService.md#ABRequestService)
    * [.shutdown()](#ABServiceController+shutdown)
    * [.startup()](#ABServiceController+startup)
    * [._waitForConfig()](#ABServiceController+_waitForConfig) ⇒ <code>Promise</code>
    * [._waitForDB()](#ABServiceController+_waitForDB) ⇒ <code>Promise</code>
    * [._waitForRedis()](#ABServiceController+_waitForRedis) ⇒ <code>Promise</code>

<a name="new_ABServiceController_new"></a>

### new ABServiceController([key])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [key] | <code>string</code> | <code>&quot;ABServiceController&quot;</code> | key to identify the contoller |

<a name="ABServiceController+exit"></a>

### controller.exit() ⇒ <code>Promise</code>
exit this service.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+init"></a>

### controller.init() ⇒ <code>Promise</code>
begin this service.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+afterShutdown"></a>

### controller.afterShutdown(fn)
**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="ABServiceController+afterStartup"></a>

### controller.afterStartup(fn)
**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="ABServiceController+beforeShutdown"></a>

### controller.beforeShutdown(fn)
**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="ABServiceController+beforeStartup"></a>

### controller.beforeStartup(fn)
**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="ABServiceController+ready"></a>

### controller.ready()
Send a 'ready' signal on this process. Useful for service managers
(like pm2) to know the process is ready.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+requestObj"></a>

### controller.requestObj(option) ⇒ [<code>ABRequestService</code>](./ABRequestService.md#ABRequestService)
return a new ABRequest() object.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  

| Param | Type | Description |
| --- | --- | --- |
| option | <code>object</code> | any initial settings for the [ABRequestService](./ABRequestService.md#ABRequestService) obj |

<a name="ABServiceController+shutdown"></a>

### controller.shutdown()
the process a service should perform to gracefully shutdown.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+startup"></a>

### controller.startup()
the process a service should perform to startup.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+_waitForConfig"></a>

### controller.\_waitForConfig() ⇒ <code>Promise</code>
waits until the config service has posted a '.config_ready' file

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+_waitForDB"></a>

### controller.\_waitForDB() ⇒ <code>Promise</code>
attempts to connect to our maria DB service before continuing.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
<a name="ABServiceController+_waitForRedis"></a>

### controller.\_waitForRedis() ⇒ <code>Promise</code>
attempts to connect to our redis server and then resolves() once the connection is ready.

**Kind**: instance method of [<code>ABServiceController</code>](#ABServiceController)  
