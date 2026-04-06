<a name="TelemetryDefault"></a>

## TelemetryDefault
**Kind**: global class  
<a name="TelemetryDefault+notify"></a>

### telemetry.notify(req, jobData)
Send the error/notification to log_manager.notification

**Kind**: instance method of [<code>TelemetryDefault</code>](#TelemetryDefault)  

| Param | Type | Description |
| --- | --- | --- |
| req | [<code>ABRequestAPI</code>](./ABRequestAPI.md#ABRequestAPI) \| [<code>ABRequestService</code>](./ABRequestService.md#ABRequestService) |  |
| jobData | <code>object</code> |  |
| jobData.domain | <code>string</code> | notification domain ('developer' or 'builder') |
| jobData.error | <code>string</code> | serrialized error |
| jobData.info | <code>object</code> |  |
| jobData.callStack | <code>string</code> |  |

