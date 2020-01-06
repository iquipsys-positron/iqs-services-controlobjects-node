let _ = require('lodash');
let async = require('async');

import { IZonesClientV1 } from 'iqs-clients-zones-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';

export class ZonesConnector {

    public constructor(
        private _zonesClient: IZonesClientV1
    ) {}

    public unsetObject(correlationId: string, obj: ControlObjectV1,
        callback: (err: any) => void) : void {
        
        if (this._zonesClient == null || obj == null) {
            callback(null);
            return;
        }

        this._zonesClient.unsetObject(correlationId, obj.org_id, obj.id, callback);
    }

}