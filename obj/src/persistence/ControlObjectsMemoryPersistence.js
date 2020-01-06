"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class ControlObjectsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.description, search))
            return true;
        if (this.matchString(item.pin, search))
            return true;
        if (this.matchString(item.phone, search))
            return true;
        return false;
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let category = filter.getAsNullableString('category');
        let type = filter.getAsNullableString('type');
        let orgId = filter.getAsNullableString('org_id');
        let objectId = filter.getAsNullableString('object_id');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        return (item) => {
            if (id && item.id != id)
                return false;
            if (category && item.category != category)
                return false;
            if (type && item.type != type)
                return false;
            if (orgId && item.org_id != orgId)
                return false;
            if (objectId && item.object_id != objectId)
                return false;
            if (!deleted && item.deleted)
                return false;
            if (search && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    unsetObject(correlationId, orgId, objectId, callback) {
        let updated = false;
        _.each(this._items, (item) => {
            if (item.org_id == orgId && item.perm_assign_id == objectId) {
                updated = true;
                item.assignId = null;
            }
        });
        if (!updated) {
            if (callback)
                callback(null);
            return;
        }
        this._logger.trace(correlationId, "Unset object %s", objectId);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
}
exports.ControlObjectsMemoryPersistence = ControlObjectsMemoryPersistence;
//# sourceMappingURL=ControlObjectsMemoryPersistence.js.map