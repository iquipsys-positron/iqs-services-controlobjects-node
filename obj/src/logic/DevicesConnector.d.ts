import { IDevicesClientV1 } from 'iqs-clients-devices-node';
import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
export declare class DevicesConnector {
    private _devicesClient;
    constructor(_devicesClient: IDevicesClientV1);
    setDevice(correlationId: string, obj: ControlObjectV1, callback: (err: any) => void): void;
    updateDevices(correlationId: string, oldObject: ControlObjectV1, newObject: ControlObjectV1, callback: (err: any) => void): void;
    unsetDevice(correlationId: string, obj: ControlObjectV1, callback: (err: any) => void): void;
}
