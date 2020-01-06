import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { ControlObjectsMongoDbPersistence } from '../persistence/ControlObjectsMongoDbPersistence';
import { ControlObjectsFilePersistence } from '../persistence/ControlObjectsFilePersistence';
import { ControlObjectsMemoryPersistence } from '../persistence/ControlObjectsMemoryPersistence';
import { ControlObjectsController } from '../logic/ControlObjectsController';
import { ControlObjectsHttpServiceV1 } from '../services/version1/ControlObjectsHttpServiceV1';

export class ControlObjectsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-controlobjects", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-controlobjects", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-controlobjects", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-controlobjects", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-controlobjects", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-controlobjects", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(ControlObjectsServiceFactory.MemoryPersistenceDescriptor, ControlObjectsMemoryPersistence);
		this.registerAsType(ControlObjectsServiceFactory.FilePersistenceDescriptor, ControlObjectsFilePersistence);
		this.registerAsType(ControlObjectsServiceFactory.MongoDbPersistenceDescriptor, ControlObjectsMongoDbPersistence);
		this.registerAsType(ControlObjectsServiceFactory.ControllerDescriptor, ControlObjectsController);
		this.registerAsType(ControlObjectsServiceFactory.HttpServiceDescriptor, ControlObjectsHttpServiceV1);
	}
	
}
