<a name="TelemetryOpenTelemetry"></a>

## TelemetryOpenTelemetry
**Kind**: global class  

* [TelemetryOpenTelemetry](#TelemetryOpenTelemetry)
    * [.init(config)](#TelemetryOpenTelemetry+init)
    * [.startSpan(key, attributes)](#TelemetryOpenTelemetry+startSpan) ⇒ <code>opentelemetry.api.Span</code>
    * [.startChildSpan(key, attributes, [parent])](#TelemetryOpenTelemetry+startChildSpan) ⇒ <code>opentelemetry.api.Span</code>
    * [.endSpan(key)](#TelemetryOpenTelemetry+endSpan)

<a name="TelemetryOpenTelemetry+init"></a>

### telemetryOpenTelemetry.init(config)
**Kind**: instance method of [<code>TelemetryOpenTelemetry</code>](#TelemetryOpenTelemetry)  
**Init**:   

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> |  |
| config.spanProcessor | <code>opentelemetry.node.SpanProcessor</code> |  |
| config.textMapPropagator | <code>opentelemetry.api.TextMapPropagator</code> |  |
| config.name | <code>string</code> | name to use for the Tracer |
| config.version | <code>string</code> | version to use for the Tracer |

<a name="TelemetryOpenTelemetry+startSpan"></a>

### telemetryOpenTelemetry.startSpan(key, attributes) ⇒ <code>opentelemetry.api.Span</code>
Start an open telemetry span

**Kind**: instance method of [<code>TelemetryOpenTelemetry</code>](#TelemetryOpenTelemetry)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | unique identifier |
| attributes | <code>object</code> | extra attributes to add the span |

<a name="TelemetryOpenTelemetry+startChildSpan"></a>

### telemetryOpenTelemetry.startChildSpan(key, attributes, [parent]) ⇒ <code>opentelemetry.api.Span</code>
Start an open telemetry span as a child of an existing span

**Kind**: instance method of [<code>TelemetryOpenTelemetry</code>](#TelemetryOpenTelemetry)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | unique identifier |
| attributes | <code>object</code> | extra attributes to add the span |
| [parent] | <code>opentelemetry.api.Span</code> | the parent span |

<a name="TelemetryOpenTelemetry+endSpan"></a>

### telemetryOpenTelemetry.endSpan(key)
End the given span

**Kind**: instance method of [<code>TelemetryOpenTelemetry</code>](#TelemetryOpenTelemetry)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | unique identifier |

