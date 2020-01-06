import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';

export interface IControlObjectsPersistence extends IGetter<ControlObjectV1, string>, IWriter<ControlObjectV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ControlObjectV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: ControlObjectV1) => void): void;

    create(correlationId: string, item: ControlObjectV1, 
        callback: (err: any, item: ControlObjectV1) => void): void;

    update(correlationId: string, item: ControlObjectV1, 
        callback: (err: any, item: ControlObjectV1) => void): void;

    unsetObject(correlationId: string, orgId: string, objectId: string,
        callback: (err: any) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: ControlObjectV1) => void): void;
}
