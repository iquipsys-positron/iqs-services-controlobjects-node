import { IStringIdentifiable } from 'pip-services3-commons-node';

export class ControlObjectV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public category: string;
    public type: string;
    public deleted?: boolean;

    public name: string;
    public description?: string;
    public email?: string;
    public phone?: string;
    public pin?: string;
    public device_id?: string;
    public perm_assign_id?: string;
    public group_ids?: string[];
}