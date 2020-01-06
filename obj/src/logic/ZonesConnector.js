"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class ZonesConnector {
    constructor(_zonesClient) {
        this._zonesClient = _zonesClient;
    }
    unsetObject(correlationId, obj, callback) {
        if (this._zonesClient == null || obj == null) {
            callback(null);
            return;
        }
        this._zonesClient.unsetObject(correlationId, obj.org_id, obj.id, callback);
    }
}
exports.ZonesConnector = ZonesConnector;
//# sourceMappingURL=ZonesConnector.js.map