let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ControlObjectV1 } from '../../../src/data/version1/ControlObjectV1';
import { ControlObjectsMemoryPersistence } from '../../../src/persistence/ControlObjectsMemoryPersistence';
import { ControlObjectsController } from '../../../src/logic/ControlObjectsController';
import { ControlObjectsHttpServiceV1 } from '../../../src/services/version1/ControlObjectsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let OBJECT1: ControlObjectV1 = {
    id: '1',
    org_id: '1',
    category: 'person',
    type: 'employee',
    name: 'Object 1',
    description: 'Control object #1',
    device_id: '1',
    group_ids: ['1', '2']
};
let OBJECT2: ControlObjectV1 = {
    id: '2',
    org_id: '1',
    category: 'person',
    type: 'visitor',
    name: 'Object 2',
    description: 'Control object #2',
    device_id: '2',
    group_ids: ['1', '2']
};

suite('ControlObjectsHttpServiceV1', ()=> {    
    let service: ControlObjectsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new ControlObjectsMemoryPersistence();
        let controller = new ControlObjectsController();

        service = new ControlObjectsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-controlobjects', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-controlobjects', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-controlobjects', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let object1, object2;

        async.series([
        // Create one object
            (callback) => {
                rest.post('/v1/control_objects/create_object',
                    {
                        object: OBJECT1
                    },
                    (err, req, res, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, OBJECT1.name);
                        assert.equal(object.description, OBJECT1.description);
                        assert.equal(object.category, OBJECT1.category);
                        assert.equal(object.type, OBJECT1.type);

                        object1 = object;

                        callback();
                    }
                );
            },
        // Create another object
            (callback) => {
                rest.post('/v1/control_objects/create_object', 
                    {
                        object: OBJECT2
                    },
                    (err, req, res, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, OBJECT2.name);
                        assert.equal(object.description, OBJECT2.description);
                        assert.equal(object.category, OBJECT2.category);
                        assert.equal(object.type, OBJECT2.type);

                        object2 = object;

                        callback();
                    }
                );
            },
        // Get all objects
            (callback) => {
                rest.post('/v1/control_objects/get_objects',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the object
            (callback) => {
                object1.name = 'Updated object 1';

                rest.post('/v1/control_objects/update_object',
                    { 
                        object: object1
                    },
                    (err, req, res, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, 'Updated object 1');
                        assert.equal(object.id, object1.id);

                        object1 = object;

                        callback();
                    }
                );
            },
        // Delete object
            (callback) => {
                rest.post('/v1/control_objects/delete_object_by_id',
                    {
                        object_id: object1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete object
            (callback) => {
                rest.post('/v1/control_objects/get_object_by_id',
                    {
                        object_id: object1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isNotNull(result);
                        assert.isTrue(result.deleted);

                        callback();
                    }
                );
            }
        ], done);
    });
});