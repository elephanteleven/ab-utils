<a name="Telemetry"></a>

## Telemetry
Interface for a telemetry provider;

**Kind**: global class  

* [Telemetry](#Telemetry)
    * [.init(vendor, config)](#Telemetry+init)
    * [.notify(...args)](#Telemetry+notify)
    * [.setContext(...args)](#Telemetry+setContext)
    * [.startSpan(...args)](#Telemetry+startSpan)
    * [.startChildSpan(...args)](#Telemetry+startChildSpan)
    * [.endSpan(...args)](#Telemetry+endSpan)

<a name="Telemetry+init"></a>

### telemetry.init(vendor, config)
Initialize a specefic telemetry provider class

**Kind**: instance method of [<code>Telemetry</code>](#Telemetry)  

| Param | Type | Description |
| --- | --- | --- |
| vendor | <code>string</code> | telemetry provider to use (currently supported: 'sentry') |
| config | <code>object</code> | options to initialize with |

<a name="Telemetry+notify"></a>

### telemetry.notify(...args)
Call the telemetry provider's notify method to handle errors and messages.

**Kind**: instance method of [<code>Telemetry</code>](#Telemetry)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="Telemetry+setContext"></a>

### telemetry.setContext(...args)
Call the telemetry provider's setContext method (if it exists) to provide
additonal data.

**Kind**: instance method of [<code>Telemetry</code>](#Telemetry)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="Telemetry+startSpan"></a>

### telemetry.startSpan(...args)
Call the telemetry provider's startSpan method (if it exists) to start
a tracking Span.

**Kind**: instance method of [<code>Telemetry</code>](#Telemetry)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="Telemetry+startChildSpan"></a>

### telemetry.startChildSpan(...args)
Call the telemetry provider's startChildSpan method (if it exists) to start
a tracking Span as child of an existing span.

**Kind**: instance method of [<code>Telemetry</code>](#Telemetry)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

<a name="Telemetry+endSpan"></a>

### telemetry.endSpan(...args)
Call the telemetry provider's endSpan method (if it exists) to end
an ongoing tracking Span.

**Kind**: instance method of [<code>Telemetry</code>](#Telemetry)  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> | 

