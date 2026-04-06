<a name="ABService"></a>

## ABService ⇐ <code>EventEmitter</code>
**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [ABService](#ABService) ⇐ <code>EventEmitter</code>
    * [new ABService(options)](#new_ABService_new)
    * [.ready()](#ABService+ready)
    * [.run()](#ABService+run)
    * [.shutdown()](#ABService+shutdown)
    * [.startup()](#ABService+startup)

<a name="new_ABService_new"></a>

### new ABService(options)
Define a common AppBuilder Service class for use in our micro services.


| Param | Type | Default |
| --- | --- | --- |
| options | <code>obj</code> |  | 
| [options.name] | <code>string</code> | <code>&quot;ABService&quot;</code> | 

<a name="ABService+ready"></a>

### abService.ready()
ready
Send a 'ready' signal on this process. Useful for service managers
(like pm2) to know the process is ready.

**Kind**: instance method of [<code>ABService</code>](#ABService)  
<a name="ABService+run"></a>

### abService.run()
run
the operation of the Service.  It will be run after the .startup()
routine is completed.

**Kind**: instance method of [<code>ABService</code>](#ABService)  
<a name="ABService+shutdown"></a>

### abService.shutdown()
shutdown
the process a service should perform to gracefully shutdown.

**Kind**: instance method of [<code>ABService</code>](#ABService)  
<a name="ABService+startup"></a>

### abService.startup()
startup
the process a service should perform to startup.

**Kind**: instance method of [<code>ABService</code>](#ABService)  
