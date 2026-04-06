<a name="telemetrySentry"></a>

## telemetrySentry
**Kind**: global class  

* [telemetrySentry](#telemetrySentry)
    * [.init(options)](#telemetrySentry+init)
    * [.notify(jobData, error)](#telemetrySentry+notify)
    * [.setContext(key, data)](#telemetrySentry+setContext)

<a name="telemetrySentry+init"></a>

### telemetry.init(options)
Initialize Sentry

**Kind**: instance method of [<code>telemetrySentry</code>](#telemetrySentry)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Sentry.NodeOptions</code> | sentry options |

<a name="telemetrySentry+notify"></a>

### telemetry.notify(jobData, error)
Send errors and notifications to sentry

**Kind**: instance method of [<code>telemetrySentry</code>](#telemetrySentry)  

| Param | Type | Description |
| --- | --- | --- |
| jobData | <code>object</code> |  |
| jobData.domain | <code>string</code> | notification domain ('developer' or 'builder') |
| jobData.error | <code>string</code> | serrialized error |
| jobData.info | <code>object</code> |  |
| jobData.callStack | <code>string</code> |  |
| error | <code>Error</code> | the origianl error |

<a name="telemetrySentry+setContext"></a>

### telemetry.setContext(key, data)
Provide additional context to Sentry

**Kind**: instance method of [<code>telemetrySentry</code>](#telemetrySentry)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | type of context (tags, user, or any other) |
| data | <code>object</code> |  |

