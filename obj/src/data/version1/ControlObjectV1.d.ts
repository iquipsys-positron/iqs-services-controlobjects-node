import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class ControlObjectV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    category: string;
    type: string;
    deleted?: boolean;
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    pin?: string;
    device_id?: string;
    perm_assign_id?: string;
    group_ids?: string[];
}
