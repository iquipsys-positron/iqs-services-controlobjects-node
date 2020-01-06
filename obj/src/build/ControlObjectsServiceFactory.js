"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ControlObjectsMongoDbPersistence_1 = require("../persistence/ControlObjectsMongoDbPersistence");
const ControlObjectsFilePersistence_1 = require("../persistence/ControlObjectsFilePersistence");
const ControlObjectsMemoryPersistence_1 = require("../persistence/ControlObjectsMemoryPersistence");
const ControlObjectsController_1 = require("../logic/ControlObjectsController");
const ControlObjectsHttpServiceV1_1 = require("../services/version1/ControlObjectsHttpServiceV1");
class ControlObjectsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ControlObjectsServiceFactory.MemoryPersistenceDescriptor, ControlObjectsMemoryPersistence_1.ControlObjectsMemoryPersistence);
        this.registerAsType(ControlObjectsServiceFactory.FilePersistenceDescriptor, ControlObjectsFilePersistence_1.ControlObjectsFilePersistence);
        this.registerAsType(ControlObjectsServiceFactory.MongoDbPersistenceDescriptor, ControlObjectsMongoDbPersistence_1.ControlObjectsMongoDbPersistence);
        this.registerAsType(ControlObjectsServiceFactory.ControllerDescriptor, ControlObjectsController_1.ControlObjectsController);
        this.registerAsType(ControlObjectsServiceFactory.HttpServiceDescriptor, ControlObjectsHttpServiceV1_1.ControlObjectsHttpServiceV1);
    }
}
exports.ControlObjectsServiceFactory = ControlObjectsServiceFactory;
ControlObjectsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-controlobjects", "factory", "default", "default", "1.0");
ControlObjectsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-controlobjects", "persistence", "memory", "*", "1.0");
ControlObjectsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-controlobjects", "persistence", "file", "*", "1.0");
ControlObjectsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-controlobjects", "persistence", "mongodb", "*", "1.0");
ControlObjectsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-controlobjects", "controller", "default", "*", "1.0");
ControlObjectsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-controlobjects", "service", "http", "*", "1.0");
//# sourceMappingURL=ControlObjectsServiceFactory.js.map