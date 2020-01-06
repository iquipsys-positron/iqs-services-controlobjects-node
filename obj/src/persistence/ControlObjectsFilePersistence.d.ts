import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { ControlObjectsMemoryPersistence } from './ControlObjectsMemoryPersistence';
import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
export declare class ControlObjectsFilePersistence extends ControlObjectsMemoryPersistence {
    protected _persister: JsonFilePersister<ControlObjectV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
