import { IZonesClientV1 } from 'iqs-clients-zones-node';
import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
export declare class ZonesConnector {
    private _zonesClient;
    constructor(_zonesClient: IZonesClientV1);
    unsetObject(correlationId: string, obj: ControlObjectV1, callback: (err: any) => void): void;
}
