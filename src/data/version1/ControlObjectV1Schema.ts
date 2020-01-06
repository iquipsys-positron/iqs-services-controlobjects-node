import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class ControlObjectV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('category', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);
        this.withOptionalProperty('description', TypeCode.String);
        this.withOptionalProperty('email', TypeCode.String);
        this.withOptionalProperty('phone', TypeCode.String);
        this.withOptionalProperty('pin', TypeCode.String);
        this.withOptionalProperty('device_id', TypeCode.String);
        this.withOptionalProperty('perm_assign_id', TypeCode.String);
        this.withOptionalProperty('group_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('deleted', TypeCode.Boolean);
    }
}
