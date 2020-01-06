import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class ControlObjectsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/control_objects');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-controlobjects', 'controller', 'default', '*', '1.0'));
    }
}