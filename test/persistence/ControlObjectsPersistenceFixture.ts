let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ControlObjectV1 } from '../../src/data/version1/ControlObjectV1';

import { IControlObjectsPersistence } from '../../src/persistence/IControlObjectsPersistence';

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
let OBJECT3: ControlObjectV1 = {
    id: '3',
    org_id: '2',
    category: 'asset',
    type: 'pump',
    name: 'Object 3',
    description: 'Control object #3',
};

export class ControlObjectsPersistenceFixture {
    private _persistence: IControlObjectsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateControlObjects(done) {
        async.series([
        // Create one object
            (callback) => {
                this._persistence.create(
                    null,
                    OBJECT1,
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, OBJECT1.name);
                        assert.equal(object.description, OBJECT1.description);
                        assert.equal(object.category, OBJECT1.category);
                        assert.equal(object.type, OBJECT1.type);

                        callback();
                    }
                );
            },
        // Create another object
            (callback) => {
                this._persistence.create(
                    null,
                    OBJECT2,
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, OBJECT2.name);
                        assert.equal(object.description, OBJECT2.description);
                        assert.equal(object.category, OBJECT2.category);
                        assert.equal(object.type, OBJECT2.type);

                        callback();
                    }
                );
            },
        // Create yet another object
            (callback) => {
                this._persistence.create(
                    null,
                    OBJECT3,
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, OBJECT3.name);
                        assert.equal(object.description, OBJECT3.description);
                        assert.equal(object.category, OBJECT3.category);
                        assert.equal(object.type, OBJECT3.type);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let object1: ControlObjectV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateControlObjects(callback);
            },
        // Get all objects
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        object1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the object
            (callback) => {
                object1.name = 'Updated object 1';

                this._persistence.update(
                    null,
                    object1,
                    (err, object) => {
                        assert.isNull(err);

                        assert.isObject(object);
                        assert.equal(object.name, 'Updated object 1');
                        assert.equal(object.id, object1.id);

                        callback();
                    }
                );
            },
        // Delete object
            (callback) => {
                this._persistence.deleteById(
                    null,
                    object1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete object
            (callback) => {
                this._persistence.getOneById(
                    null,
                    object1.id,
                    (err, object) => {
                        assert.isNull(err);

                        assert.isNull(object || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create objects
            (callback) => {
                this.testCreateControlObjects(callback);
            },
        // Get objects filtered by tags
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        search: 'obj'
                    }),
                    new PagingParams(),
                    (err, objects) => {
                        assert.isNull(err);

                        assert.isObject(objects);
                        assert.lengthOf(objects.data, 3);

                        callback();
                    }
                );
            },
        // Get objects for specified organization
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, objects) => {
                        assert.isNull(err);

                        assert.isObject(objects);
                        assert.lengthOf(objects.data, 2);

                        callback();
                    }
                );
            },
        // Get objects filtered by category
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        category: 'person'
                    }),
                    new PagingParams(),
                    (err, objects) => {
                        assert.isNull(err);

                        assert.isObject(objects);
                        assert.lengthOf(objects.data, 2);

                        callback();
                    }
                );
            },
        // Get objects filtered by category
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        type: 'pump'
                    }),
                    new PagingParams(),
                    (err, objects) => {
                        assert.isNull(err);

                        assert.isObject(objects);
                        assert.lengthOf(objects.data, 1);

                        callback();
                    }
                );
            },
        ], done);
    }

}
