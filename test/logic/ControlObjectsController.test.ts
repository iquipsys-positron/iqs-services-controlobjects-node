let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { ControlObjectV1 } from '../../src/data/version1/ControlObjectV1';
import { ControlObjectsMemoryPersistence } from '../../src/persistence/ControlObjectsMemoryPersistence';
import { ControlObjectsController } from '../../src/logic/ControlObjectsController';

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

suite('ControlObjectsController', ()=> {
    let persistence: ControlObjectsMemoryPersistence;
    let controller: ControlObjectsController;

    suiteSetup((done) => {
        persistence = new ControlObjectsMemoryPersistence();
        controller = new ControlObjectsController();

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-controlobjects', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-controlobjects', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);

        persistence.open(null, done);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var object1, object2;

        async.series([
        // Create one object
            (callback) => {
                controller.createObject(
                    null, OBJECT1,
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
                controller.createObject(
                    null, OBJECT2,
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
                controller.getObjects(
                    null,
                    new FilterParams(),
                    new PagingParams(),
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

                controller.updateObject(
                    null, object1,
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
                controller.deleteObjectById(
                    null, object1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Check logical deletion
            (callback) => {
                controller.getObjectById(
                    null, object1.id,
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

    test('Set and unset device', (done) => {
        var object1, object2;

        async.series([
        // Create one object
            (callback) => {
                controller.createObject(
                    null, OBJECT1,
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
        // Set device
            (callback) => {
                controller.setDevice(
                    null, object1.id, '5',
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.id, object1.id);
                        assert.equal(object.device_id, '5');

                        object1 = object;

                        callback();
                    }
                );
            },
        // Unset device
            (callback) => {
                controller.unsetDevice(
                    null, object1.id,
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.id, object1.id);
                        assert.isNull(object.device_id);

                        object1 = object;

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Add and remove groups', (done) => {
        var object1, object2;

        async.series([
        // Create one object
            (callback) => {
                controller.createObject(
                    null, OBJECT1,
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
        // Remove group
            (callback) => {
                controller.removeGroup(
                    null, object1.id, '2',
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.id, object1.id);
                        assert.sameMembers(object.group_ids, ['1']);

                        object1 = object;

                        callback();
                    }
                );
            },
        // Add group
            (callback) => {
                controller.addGroup(
                    null, object1.id, '5',
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.id, object1.id);
                        assert.sameMembers(object.group_ids, ['1', '5']);
                        object1 = object;

                        callback();
                    }
                );
            }
        ], done);
    });

});