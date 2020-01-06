let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { NotFoundException } from 'pip-services3-commons-node';

import { IObjectGroupsClientV1 } from 'iqs-clients-objectgroups-node';
import { IDevicesClientV1 } from 'iqs-clients-devices-node';
import { IZonesClientV1 } from 'iqs-clients-zones-node';
import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
import { IControlObjectsPersistence } from '../persistence/IControlObjectsPersistence';
import { IControlObjectsController } from './IControlObjectsController';
import { ControlObjectsCommandSet } from './ControlObjectsCommandSet';
import { ObjectGroupsConnector } from './ObjectGroupsConnector';
import { DevicesConnector } from './DevicesConnector';
import { ZonesConnector } from './ZonesConnector';
import { EventRulesConnector } from './EventRulesConnector';

export class ControlObjectsController implements  IConfigurable, IReferenceable, ICommandable, IControlObjectsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-controlobjects:persistence:*:*:1.0',
        'dependencies.object-groups', 'iqs-services-objectgroups:client:*:*:1.0',
        'dependencies.devices', 'iqs-services-devices:client:*:*:1.0',
        'dependencies.zones', 'iqs-services-zones:client:*:*:1.0',
        'dependencies.event-rules', 'iqs-services-eventrules:client:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(ControlObjectsController._defaultConfig);
    private _groupsClient: IObjectGroupsClientV1;
    private _groupsConnector: ObjectGroupsConnector;
    private _devicesClient: IDevicesClientV1;
    private _devicesConnector: DevicesConnector;
    private _zonesClient: IZonesClientV1;
    private _zonesConnector: ZonesConnector;
    private _eventRulesClient: IEventRulesClientV1;
    private _eventRulesConnector: EventRulesConnector;
    private _persistence: IControlObjectsPersistence;
    private _commandSet: ControlObjectsCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IControlObjectsPersistence>('persistence');

        this._groupsClient = this._dependencyResolver.getOneOptional<IObjectGroupsClientV1>('object-groups');
        this._groupsConnector = new ObjectGroupsConnector(this._groupsClient);
        this._devicesClient = this._dependencyResolver.getOneOptional<IDevicesClientV1>('devices');
        this._devicesConnector = new DevicesConnector(this._devicesClient);
        this._zonesClient = this._dependencyResolver.getOneOptional<IZonesClientV1>('zones');
        this._zonesConnector = new ZonesConnector(this._zonesClient);
        this._eventRulesClient = this._dependencyResolver.getOneOptional<IEventRulesClientV1>('event-rules');
        this._eventRulesConnector = new EventRulesConnector(this._eventRulesClient);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new ControlObjectsCommandSet(this);
        return this._commandSet;
    }
    
    public getObjects(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ControlObjectV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getObjectById(correlationId: string, id: string, 
        callback: (err: any, object: ControlObjectV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);        
    }

    public createObject(correlationId: string, obj: ControlObjectV1, 
        callback: (err: any, obj: ControlObjectV1) => void): void {
        let newObject: ControlObjectV1;

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

    public updateObject(correlationId: string, obj: ControlObjectV1, 
        callback: (err: any, obj: ControlObjectV1) => void): void {
        let oldObject: ControlObjectV1;
        let newObject: ControlObjectV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, obj.id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'OBJECT_NOT_FOUND',
                            'Controlled object ' + obj.id + ' was not found'
                        ).withDetails('object_id', obj.id);
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

    public deleteObjectById(correlationId: string, id: string,
        callback: (err: any, obj: ControlObjectV1) => void): void {  
        let oldObject: ControlObjectV1;
        let newObject: ControlObjectV1;

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
                else callback();
            },
            // Unset object from the other side
            (callback) => {
                if (oldObject)
                    this._devicesConnector.unsetDevice(correlationId, oldObject, callback);
                else callback();
            },
            // Remove from all groups
            (callback) => {
                if (oldObject)
                    this._groupsConnector.removeGroups(correlationId, oldObject, callback);
                else callback();
            },
            // Remove from all zones
            (callback) => {
                if (oldObject)
                    this._zonesConnector.unsetObject(correlationId, oldObject, callback);
                else callback();
            },
            // Remove from all rules
            (callback) => {
                if (oldObject)
                    this._eventRulesConnector.unsetObject(correlationId, oldObject, callback);
                else callback();
            }
        ], (err) => {
            callback(err, err == null ? newObject : null);
        });    
    }

    public setDevice(correlationId: string, object_id: string, device_id: string, 
        callback: (err: any, obj: ControlObjectV1) => void): void {
        let oldObject: ControlObjectV1;
        let newObject: ControlObjectV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'OBJECT_NOT_FOUND',
                            'Controlled object ' + object_id + ' was not found'
                        ).withDetails('object_id', object_id);
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

    public unsetDevice(correlationId: string, object_id: string,
        callback: (err: any, obj: ControlObjectV1) => void): void {
        let oldObject: ControlObjectV1;
        let newObject: ControlObjectV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'OBJECT_NOT_FOUND',
                            'Controlled object ' + object_id + ' was not found'
                        ).withDetails('object_id', object_id);
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

    public addGroup(correlationId: string, object_id: string, group_id: string,
        callback: (err: any, obj: ControlObjectV1) => void): void {
        let oldObject: ControlObjectV1;
        let newObject: ControlObjectV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'OBJECT_NOT_FOUND',
                            'Controlled object ' + object_id + ' was not found'
                        ).withDetails('object_id', object_id);
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

    public removeGroup(correlationId: string, object_id: string, group_id: string,
        callback: (err: any, obj: ControlObjectV1) => void): void {
        let oldObject: ControlObjectV1;
        let newObject: ControlObjectV1;

        async.series([
            // Get previous value
            (callback) => {
                this._persistence.getOneById(correlationId, object_id, (err, data) => {
                    if (err == null && data == null) {
                        err = new NotFoundException(
                            correlationId,
                            'OBJECT_NOT_FOUND',
                            'Controlled object ' + object_id + ' was not found'
                        ).withDetails('object_id', object_id);
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
