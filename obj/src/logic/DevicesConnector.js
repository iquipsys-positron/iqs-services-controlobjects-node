"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class DevicesConnector {
    constructor(_devicesClient) {
        this._devicesClient = _devicesClient;
    }
    setDevice(correlationId, obj, callback) {
        if (this._devicesClient == null || obj == null || obj.device_id == null) {
            callback(null);
            return;
        }
        this._devicesClient.setObject(correlationId, obj.device_id, obj.id, callback);
    }
    updateDevices(correlationId, oldObject, newObject, callback) {
        if (this._devicesClient == null || oldObject == null || newObject == null
            || oldObject.device_id == newObject.device_id) {
            callback(null);
            return;
        }
        async.parallel([
            (callback) => {
                if (oldObject.device_id != null)
                    this._devicesClient.unsetObject(correlationId, oldObject.device_id, callback);
                else
                    callback();
            },
            (callback) => {
                if (newObject.device_id != null)
                    this._devicesClient.setObject(correlationId, newObject.device_id, newObject.id, callback);
                else
                    callback();
            }
        ], callback);
    }
    unsetDevice(correlationId, obj, callback) {
        if (this._devicesClient == null || obj == null || obj.device_id == null) {
            callback(null);
            return;
        }
        this._devicesClient.unsetObject(correlationId, obj.device_id, callback);
    }
}
exports.DevicesConnector = DevicesConnector;
//# sourceMappingURL=DevicesConnector.js.map