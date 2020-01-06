"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const ControlObjectsServiceFactory_1 = require("../build/ControlObjectsServiceFactory");
class ControlObjectsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("control_objects", "Controlled objects function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-controlobjects', 'controller', 'default', '*', '*'));
        this._factories.add(new ControlObjectsServiceFactory_1.ControlObjectsServiceFactory());
    }
}
exports.ControlObjectsLambdaFunction = ControlObjectsLambdaFunction;
exports.handler = new ControlObjectsLambdaFunction().getHandler();
//# sourceMappingURL=ControlObjectsLambdaFunction.js.map