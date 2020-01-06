let _ = require('lodash');
let async = require('async');

import { IDevicesClientV1 } from 'iqs-clients-devices-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';

export class DevicesConnector {

    public constructor(
        private _devicesClient: IDevicesClientV1
    ) {}

    public setDevice(correlationId: string, obj: ControlObjectV1,
        callback: (err: any) => void) : void {
        
        if (this._devicesClient == null || obj == null || obj.device_id == null) {
            callback(null);
            return;
        }

        this._devicesClient.setObject(correlationId, obj.device_id, obj.id, callback);
    }

    public updateDevices(correlationId: string, oldObject: ControlObjectV1,
        newObject: ControlObjectV1, callback: (err: any) => void) : void {
        
        if (this._devicesClient == null || oldObject == null || newObject == null
            || oldObject.device_id == newObject.device_id) {
            callback(null);
            return;
        }

        async.parallel([
            (callback) => {
                if (oldObject.device_id != null)
                    this._devicesClient.unsetObject(correlationId, oldObject.device_id, callback);
                else callback();
            },
            (callback) => {
                if (newObject.device_id != null)
                    this._devicesClient.setObject(correlationId, newObject.device_id, newObject.id, callback);
                else callback();
            }
        ], callback);
    }

    public unsetDevice(correlationId: string, obj: ControlObjectV1,
        callback: (err: any) => void) : void {
        
        if (this._devicesClient == null || obj == null || obj.device_id == null) {
            callback(null);
            return;
        }

        this._devicesClient.unsetObject(correlationId, obj.device_id, callback);
    }

}