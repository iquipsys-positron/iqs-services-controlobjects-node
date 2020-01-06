"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class ObjectGroupsConnector {
    constructor(_groupsClient) {
        this._groupsClient = _groupsClient;
    }
    addGroups(correlationId, obj, callback) {
        if (this._groupsClient == null || obj == null) {
            callback(null);
            return;
        }
        async.each(obj.group_ids, (groupId, callback) => {
            this._groupsClient.addObject(correlationId, groupId, obj.id, callback);
        }, callback);
    }
    updateGroups(correlationId, oldObject, newObject, callback) {
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
    removeGroups(correlationId, obj, callback) {
        if (this._groupsClient == null || obj == null) {
            callback(null);
            return;
        }
        async.each(obj.group_ids, (groupId, callback) => {
            this._groupsClient.removeObject(correlationId, groupId, obj.id, callback);
        }, callback);
    }
}
exports.ObjectGroupsConnector = ObjectGroupsConnector;
//# sourceMappingURL=ObjectGroupsConnector.js.map