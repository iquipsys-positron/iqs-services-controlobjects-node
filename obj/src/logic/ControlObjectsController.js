"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const ControlObjectsCommandSet_1 = require("./ControlObjectsCommandSet");
const ObjectGroupsConnector_1 = require("./ObjectGroupsConnector");
const DevicesConnector_1 = require("./DevicesConnector");
const ZonesConnector_1 = require("./ZonesConnector");
const EventRulesConnector_1 = require("./EventRulesConnector");
class ControlObjectsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(ControlObjectsController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._groupsClient = this._dependencyResolver.getOneOptional('object-groups');
        this._groupsConnector = new ObjectGroupsConnector_1.ObjectGroupsConnector(this._groupsClient);
        this._devicesClient = this._dependencyResolver.getOneOptional('devices');
        this._devicesConnector = new DevicesConnector_1.DevicesConnector(this._devicesClient);
        this._zonesClient = this._dependencyResolver.getOneOptional('zones');
        this._zonesConnector = new ZonesConnector_1.ZonesConnector(this._zonesClient);
        this._eventRulesClient = this._dependencyResolver.getOneOptional('event-rules');
        this._eventRulesConnector = new EventRulesConnector_1.EventRulesConnector(this._eventRulesClient);
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new ControlObjectsCommandSet_1.ControlObjectsCommandSet(this);
        return this._commandSet;
    }
    getObjects(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getObjectById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    createObject(correlationId, obj, callback) {
        let newObject;
        async.series([
            // Create object
            (callback) => {
                this._persistence.create(correlationId, obj, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            },
            // Set device from the other side
            (callback) => {
                this._devicesConnector.setDevice(correlationId, newObject, callback);
            },
            // Add groups from the other side
            (callback) => {
                this._groupsConnector.addGroups(correlationId, newObject, callback);
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
    updateObject(correlationId, obj, callback) {
        let oldObject;
        let newObject;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, obj.id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'OBJECT_NOT_FOUND', 'Controlled object ' + obj.id + ' was not found').withDetails('object_id', obj.id);
                    }
                    oldObject = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                this._persistence.update(correlationId, obj, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            },
            // Change device association
            (callback) => {
                this._devicesConnector.updateDevices(correlationId, oldObject, newObject, callback);
            },
            // Change group associations
            (callback) => {
                this._groupsConnector.updateGroups(correlationId, oldObject, newObject, callback);
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
    deleteObjectById(correlationId, id, callback) {
        let oldObject;
        let newObject;
        async.series([
            // Get object
            (callback) => {
                this._persistence.getOneById(correlationId, id, (err, data) => {
                    oldObject = data;
                    callback(err);
                });
            },
            // Set logical deletion flag
            (callback) => {
                if (oldObject == null) {
                    callback();
                    return;
                }
                newObject = _.clone(oldObject);
                newObject.deleted = true;
                newObject.device_id = null;
                newObject.perm_assign_id = null;
                newObject.group_ids = [];
                this._persistence.update(correlationId, newObject, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            },
            // Remove permanent assignment
            (callback) => {
                if (oldObject)
                    this._persistence.unsetObject(correlationId, oldObject.org_id, id, callback);
                else
                    callback();
            },
            // Unset object from the other side
            (callback) => {
                if (oldObject)
                    this._devicesConnector.unsetDevice(correlationId, oldObject, callback);
                else
                    callback();
            },
            // Remove from all groups
            (callback) => {
                if (oldObject)
                    this._groupsConnector.removeGroups(correlationId, oldObject, callback);
                else
                    callback();
            },
            // Remove from all zones
            (callback) => {
                if (oldObject)
                    this._zonesConnector.unsetObject(correlationId, oldObject, callback);
                else
                    callback();
            },
            // Remove from all rules
            (callback) => {
                if (oldObject)
                    this._eventRulesConnector.unsetObject(correlationId, oldObject, callback);
                else
                    callback();
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
    setDevice(correlationId, object_id, device_id, callback) {
        let oldObject;
        let newObject;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'OBJECT_NOT_FOUND', 'Controlled object ' + object_id + ' was not found').withDetails('object_id', object_id);
                    }
                    oldObject = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                newObject = _.clone(oldObject);
                newObject.device_id = device_id;
                this._persistence.update(correlationId, newObject, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            },
            // Unset previously set device
            (callback) => {
                this._devicesConnector.unsetDevice(correlationId, oldObject, callback);
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
    unsetDevice(correlationId, object_id, callback) {
        let oldObject;
        let newObject;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'OBJECT_NOT_FOUND', 'Controlled object ' + object_id + ' was not found').withDetails('object_id', object_id);
                    }
                    oldObject = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                newObject = _.clone(oldObject);
                newObject.device_id = null;
                this._persistence.update(correlationId, newObject, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
    addGroup(correlationId, object_id, group_id, callback) {
        let oldObject;
        let newObject;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'OBJECT_NOT_FOUND', 'Controlled object ' + object_id + ' was not found').withDetails('object_id', object_id);
                    }
                    oldObject = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                newObject = _.clone(oldObject);
                newObject.group_ids = _.filter(newObject.group_ids, (id) => id != group_id);
                newObject.group_ids.push(group_id);
                this._persistence.update(correlationId, newObject, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
    removeGroup(correlationId, object_id, group_id, callback) {
        let oldObject;
        let newObject;
        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'OBJECT_NOT_FOUND', 'Controlled object ' + object_id + ' was not found').withDetails('object_id', object_id);
                    }
                    oldObject = data;
                    callback(err);
                });
            },
            // Perform update
            (callback) => {
                newObject = _.clone(oldObject);
                newObject.group_ids = _.filter(newObject.group_ids, (id) => id != group_id);
                this._persistence.update(correlationId, newObject, (err, data) => {
                    newObject = data;
                    callback(err);
                });
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });
    }
}
exports.ControlObjectsController = ControlObjectsController;
ControlObjectsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-controlobjects:persistence:*:*:1.0', 'dependencies.object-groups', 'iqs-services-objectgroups:client:*:*:1.0', 'dependencies.devices', 'iqs-services-devices:client:*:*:1.0', 'dependencies.zones', 'iqs-services-zones:client:*:*:1.0', 'dependencies.event-rules', 'iqs-services-eventrules:client:*:*:1.0');
//# sourceMappingURL=ControlObjectsController.js.map