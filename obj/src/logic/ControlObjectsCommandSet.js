"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const ControlObjectV1Schema_1 = require("../data/version1/ControlObjectV1Schema");
class ControlObjectsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
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
    makeGetObjectsCommand() {
        return new pip_services3_commons_node_2.Command("get_objects", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getObjects(correlationId, filter, paging, callback);
        });
    }
    makeGetObjectByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_object_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let object_id = args.getAsString("object_id");
            this._logic.getObjectById(correlationId, object_id, callback);
        });
    }
    makeCreateObjectCommand() {
        return new pip_services3_commons_node_2.Command("create_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object', new ControlObjectV1Schema_1.ControlObjectV1Schema()), (correlationId, args, callback) => {
            let object = args.get("object");
            this._logic.createObject(correlationId, object, callback);
        });
    }
    makeUpdateObjectCommand() {
        return new pip_services3_commons_node_2.Command("update_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object', new ControlObjectV1Schema_1.ControlObjectV1Schema()), (correlationId, args, callback) => {
            let object = args.get("object");
            this._logic.updateObject(correlationId, object, callback);
        });
    }
    makeDeleteObjectByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_object_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let objectId = args.getAsNullableString("object_id");
            this._logic.deleteObjectById(correlationId, objectId, callback);
        });
    }
    makeSetDeviceCommand() {
        return new pip_services3_commons_node_2.Command("set_device", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('device_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let objectId = args.getAsNullableString("object_id");
            let deviceId = args.getAsNullableString("device_id");
            this._logic.setDevice(correlationId, objectId, deviceId, callback);
        });
    }
    makeUnsetDeviceCommand() {
        return new pip_services3_commons_node_2.Command("unset_device", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let objectId = args.getAsNullableString("object_id");
            this._logic.unsetDevice(correlationId, objectId, callback);
        });
    }
    makeAddGroupCommand() {
        return new pip_services3_commons_node_2.Command("add_group", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let objectId = args.getAsNullableString("object_id");
            let groupId = args.getAsNullableString("group_id");
            this._logic.addGroup(correlationId, objectId, groupId, callback);
        });
    }
    makeRemoveGroupCommand() {
        return new pip_services3_commons_node_2.Command("remove_group", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let objectId = args.getAsNullableString("object_id");
            let groupId = args.getAsNullableString("group_id");
            this._logic.removeGroup(correlationId, objectId, groupId, callback);
        });
    }
}
exports.ControlObjectsCommandSet = ControlObjectsCommandSet;
//# sourceMappingURL=ControlObjectsCommandSet.js.map