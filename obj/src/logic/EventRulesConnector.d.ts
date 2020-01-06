import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';
import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
export declare class EventRulesConnector {
    private _eventRulesClient;
    constructor(_eventRulesClient: IEventRulesClientV1);
    unsetObject(correlationId: string, obj: ControlObjectV1, callback: (err: any) => void): void;
}
