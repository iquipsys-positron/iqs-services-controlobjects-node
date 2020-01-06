import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { ControlObjectV1 } from '../data/version1/ControlObjectV1';
import { ControlObjectV1Schema } from '../data/version1/ControlObjectV1Schema';
import { IControlObjectsController } from './IControlObjectsController';

export class ControlObjectsCommandSet extends CommandSet {
    private _logic: IControlObjectsController;

    constructor(logic: IControlObjectsController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetObjectsCommand());
		this.addCommand(this.makeGetObjectByIdCommand());
		this.addCommand(this.makeCreateObjectCommand());
		this.addCommand(this.makeUpdateObjectCommand());
		this.addCommand(this.makeDeleteObjectByIdCommand());
		this.addCommand(this.makeSetDeviceCommand());
		this.addCommand(this.makeUnsetDeviceCommand());
		this.addCommand(this.makeAddGroupCommand());
		this.addCommand(this.makeRemoveGroupCommand());
    }

	private makeGetObjectsCommand(): ICommand {
		return new Command(
			"get_objects",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getObjects(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetObjectByIdCommand(): ICommand {
		return new Command(
			"get_object_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let object_id = args.getAsString("object_id");
                this._logic.getObjectById(correlationId, object_id, callback);
            }
		);
	}

	private makeCreateObjectCommand(): ICommand {
		return new Command(
			"create_object",
			new ObjectSchema(true)
				.withRequiredProperty('object', new ControlObjectV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let object = args.get("object");
                this._logic.createObject(correlationId, object, callback);
            }
		);
	}

	private makeUpdateObjectCommand(): ICommand {
		return new Command(
			"update_object",
			new ObjectSchema(true)
				.withRequiredProperty('object', new ControlObjectV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let object = args.get("object");
                this._logic.updateObject(correlationId, object, callback);
            }
		);
	}
	
	private makeDeleteObjectByIdCommand(): ICommand {
		return new Command(
			"delete_object_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let objectId = args.getAsNullableString("object_id");
                this._logic.deleteObjectById(correlationId, objectId, callback);
			}
		);
	}

	private makeSetDeviceCommand(): ICommand {
		return new Command(
			"set_device",
			new ObjectSchema(true)
				.withRequiredProperty('object_id', TypeCode.String)
				.withRequiredProperty('device_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let objectId = args.getAsNullableString("object_id");
                let deviceId = args.getAsNullableString("device_id");
                this._logic.setDevice(correlationId, objectId, deviceId, callback);
			}
		);
	}

	private makeUnsetDeviceCommand(): ICommand {
		return new Command(
			"unset_device",
			new ObjectSchema(true)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let objectId = args.getAsNullableString("object_id");
                this._logic.unsetDevice(correlationId, objectId, callback);
			}
		);
	}

	private makeAddGroupCommand(): ICommand {
		return new Command(
			"add_group",
			new ObjectSchema(true)
				.withRequiredProperty('object_id', TypeCode.String)
				.withRequiredProperty('group_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let objectId = args.getAsNullableString("object_id");
                let groupId = args.getAsNullableString("group_id");
                this._logic.addGroup(correlationId, objectId, groupId, callback);
			}
		);
	}

	private makeRemoveGroupCommand(): ICommand {
		return new Command(
			"remove_group",
			new ObjectSchema(true)
				.withRequiredProperty('object_id', TypeCode.String)
				.withRequiredProperty('group_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let objectId = args.getAsNullableString("object_id");
                let groupId = args.getAsNullableString("group_id");
                this._logic.removeGroup(correlationId, objectId, groupId, callback);
			}
		);
	}

}