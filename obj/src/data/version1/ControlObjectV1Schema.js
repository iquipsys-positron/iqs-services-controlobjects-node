"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class ControlObjectV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('category', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('description', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('email', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('phone', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('pin', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('device_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('perm_assign_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('group_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('deleted', pip_services3_commons_node_3.TypeCode.Boolean);
    }
}
exports.ControlObjectV1Schema = ControlObjectV1Schema;
//# sourceMappingURL=ControlObjectV1Schema.js.map