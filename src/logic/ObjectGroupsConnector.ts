let _ = require('lodash');
let async = require('async');

import { IObjectGroupsClientV1 } from 'iqs-clients-objectgroups-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';

export class ObjectGroupsConnector {

    public constructor(
        private _groupsClient: IObjectGroupsClientV1
    ) {}

    public addGroups(correlationId: string, obj: ControlObjectV1,
        callback: (err: any) => void) : void {
        
        if (this._groupsClient == null || obj == null) {
            callback(null);
            return;
        }

        async.each(obj.group_ids, (groupId, callback) => {
            this._groupsClient.addObject(correlationId, groupId, obj.id, callback);
        }, callback);
    }

    public updateGroups(correlationId: string, oldObject: ControlObjectV1,
        newObject: ControlObjectV1, callback: (err: any) => void) : void {
        
        if (this._groupsClient == null || oldObject == null || newObject == null) {
            callback(null);
            return;
        }

        let removeIds = _.difference(oldObject.group_ids, newObject.group_ids);
        let addIds = _.difference(newObject.group_ids, oldObject.group_ids);

        async.parallel([
            (callback) => {
                async.each(removeIds, (groupId, callback) => {
                    this._groupsClient.removeObject(correlationId, groupId, oldObject.id, callback);
                }, callback);
            },
            (callback) => {
                async.each(addIds, (groupId, callback) => {
                    this._groupsClient.addObject(correlationId, groupId, oldObject.id, callback);
                }, callback);
            }
        ], callback);
    }

    public removeGroups(correlationId: string, obj: ControlObjectV1,
        callback: (err: any) => void) : void {
        
        if (this._groupsClient == null || obj == null) {
            callback(null);
            return;
        }

        async.each(obj.group_ids, (groupId, callback) => {
            this._groupsClient.removeObject(correlationId, groupId, obj.id, callback);
        }, callback);
    }

}