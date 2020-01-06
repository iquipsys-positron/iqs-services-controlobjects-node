import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { ControlObjectsServiceFactory } from '../build/ControlObjectsServiceFactory';

export class ControlObjectsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("control_objects", "Controlled objects function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-controlobjects', 'controller', 'default', '*', '*'));
        this._factories.add(new ControlObjectsServiceFactory());
    }
}

export const handler = new ControlObjectsLambdaFunction().getHandler();