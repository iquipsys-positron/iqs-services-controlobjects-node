import { CommandSet } from 'pip-services3-commons-node';
import { IControlObjectsController } from './IControlObjectsController';
export declare class ControlObjectsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IControlObjectsController);
    private makeGetObjectsCommand;
    private makeGetObjectByIdCommand;
    private makeCreateObjectCommand;
    private makeUpdateObjectCommand;
    private makeDeleteObjectByIdCommand;
    private makeSetDeviceCommand;
    private makeUnsetDeviceCommand;
    private makeAddGroupCommand;
    private makeRemoveGroupCommand;
}
