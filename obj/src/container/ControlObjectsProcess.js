"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const iqs_clients_devices_node_1 = require("iqs-clients-devices-node");
const iqs_clients_objectgroups_node_1 = require("iqs-clients-objectgroups-node");
const iqs_clients_zones_node_1 = require("iqs-clients-zones-node");
const iqs_clients_eventrules_node_1 = require("iqs-clients-eventrules-node");
const ControlObjectsServiceFactory_1 = require("../build/ControlObjectsServiceFactory");
class ControlObjectsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("control_objects", "Controlled objects microservice");
        this._factories.add(new ControlObjectsServiceFactory_1.ControlObjectsServiceFactory);
        this._factories.add(new iqs_clients_devices_node_1.DevicesClientFactory);
        this._factories.add(new iqs_clients_objectgroups_node_1.ObjectGroupsClientFactory);
        this._factories.add(new iqs_clients_zones_node_1.ZonesClientFactory);
        this._factories.add(new iqs_clients_eventrules_node_1.EventRulesClientFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ControlObjectsProcess = ControlObjectsProcess;
//# sourceMappingURL=ControlObjectsProcess.js.map