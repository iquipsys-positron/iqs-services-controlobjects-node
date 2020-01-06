let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
import { IControlObjectsPersistence } from './IControlObjectsPersistence';

export class ControlObjectsMongoDbPersistence extends IdentifiableMongoDbPersistence<ControlObjectV1, string> implements IControlObjectsPersistence {

    constructor() {
        super('control_objects');
        super.ensureIndex({ org_id: 1 });
        this._maxPageSize = 1000;
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ name: { $regex: searchRegex } });
            searchCriteria.push({ description: { $regex: searchRegex } });
            searchCriteria.push({ phone: { $regex: searchRegex } });
            searchCriteria.push({ pin: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let category = filter.getAsNullableString('category');
        if (category != null)
            criteria.push({ category: category });

        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });

        let orgId = filter.getAsNullableString('org_id');
        if (orgId != null)
            criteria.push({ org_id: orgId });

        let objectId = filter.getAsNullableString('object_id');
        if (objectId != null)
            criteria.push({ object_id: objectId });

        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        if (!deleted)
            criteria.push({ $or: [ { deleted: false }, { deleted: { $exists: false } } ] });

        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ControlObjectV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public unsetObject(correlationId: string, orgId: string, objectId: string,
        callback: (err: any) => void): void {

        let filter = {
            org_id: orgId,
            perm_assign_id: objectId
        };

        let change = {
            perm_assign_id: null
        };

        this._collection.updateMany(filter, change, (err, count) => {
            if (!err)
                this._logger.trace(correlationId, "Unset object %s from %s", objectId, this._collection);

            if (callback) callback(err);
        });
    }

}
