let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { ControlObjectV1 } from '../../src/data/version1/ControlObjectV1';
import { ControlObjectsMemoryPersistence } from '../../src/persistence/ControlObjectsMemoryPersistence';
import { ControlObjectsController } from '../../src/logic/ControlObjectsController';
import { ControlObjectsLambdaFunction } from '../../src/container/ControlObjectsLambdaFunction';

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

suite('ControlObjectsLambdaFunction', ()=> {
    let lambda: ControlObjectsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-controlobjects:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-controlobjects:controller:default:default:1.0'
        );

        lambda = new ControlObjectsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var object1, object2;

        async.series([
        // Create one object
            (callback) => {
                lambda.act(
                    {
                        role: 'control_objects',
                        cmd: 'create_object',
                        object: OBJECT1
                    },
                    (err, object) => {
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
                lambda.act(
                    {
                        role: 'control_objects',
                        cmd: 'create_object',
                        object: OBJECT2
                    },
                    (err, object) => {
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
                lambda.act(
                    {
                        role: 'control_objects',
                        cmd: 'get_objects' 
                    },
                    (err, page) => {
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

                lambda.act(
                    {
                        role: 'control_objects',
                        cmd: 'update_object',
                        object: object1
                    },
                    (err, object) => {
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
                lambda.act(
                    {
                        role: 'control_objects',
                        cmd: 'delete_object_by_id',
                        object_id: object1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete object
            (callback) => {
                lambda.act(
                    {
                        role: 'control_objects',
                        cmd: 'get_object_by_id',
                        object_id: object1.id
                    },
                    (err, object) => {
                        assert.isNull(err);

                        assert.isNotNull(object);
                        assert.isTrue(object.deleted);

                        callback();
                    }
                );
            }
        ], done);
    });
});