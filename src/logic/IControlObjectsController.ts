import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';

export interface IControlObjectsController {
    getObjects(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ControlObjectV1>) => void): void;

    getObjectById(correlationId: string, object_id: string, 
        callback: (err: any, object: ControlObjectV1) => void): void;

    createObject(correlationId: string, object: ControlObjectV1, 
        callback: (err: any, object: ControlObjectV1) => void): void;

    updateObject(correlationId: string, object: ControlObjectV1, 
        callback: (err: any, object: ControlObjectV1) => void): void;

    deleteObjectById(correlationId: string, object_id: string,
        callback: (err: any, object: ControlObjectV1) => void): void;

    setDevice(correlationId: string, object_id: string, device_id: string,
        callback: (err: any, object: ControlObjectV1) => void): void;

    unsetDevice(correlationId: string, object_id: string,
        callback: (err: any, object: ControlObjectV1) => void): void;

    addGroup(correlationId: string, object_id: string, group_id: string,
        callback: (err: any, object: ControlObjectV1) => void): void;

    removeGroup(correlationId: string, object_id: string, group_id: string,
        callback: (err: any, object: ControlObjectV1) => void): void;
}
