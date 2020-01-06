import { IObjectGroupsClientV1 } from 'iqs-clients-objectgroups-node';
import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
export declare class ObjectGroupsConnector {
    private _groupsClient;
    constructor(_groupsClient: IObjectGroupsClientV1);
    addGroups(correlationId: string, obj: ControlObjectV1, callback: (err: any) => void): void;
    updateGroups(correlationId: string, oldObject: ControlObjectV1, newObject: ControlObjectV1, callback: (err: any) => void): void;
    removeGroups(correlationId: string, obj: ControlObjectV1, callback: (err: any) => void): void;
}
