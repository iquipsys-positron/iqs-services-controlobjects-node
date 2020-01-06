import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
import { IControlObjectsPersistence } from './IControlObjectsPersistence';
export declare class ControlObjectsMemoryPersistence extends IdentifiableMemoryPersistence<ControlObjectV1, string> implements IControlObjectsPersistence {
    constructor();
    private matchString;
    private matchSearch;
    private contains;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ControlObjectV1>) => void): void;
    unsetObject(correlationId: string, orgId: string, objectId: string, callback: (err: any) => void): void;
}
