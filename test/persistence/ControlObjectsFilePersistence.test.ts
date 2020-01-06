import { ConfigParams } from 'pip-services3-commons-node';

import { ControlObjectsFilePersistence } from '../../src/persistence/ControlObjectsFilePersistence';
import { ControlObjectsPersistenceFixture } from './ControlObjectsPersistenceFixture';

suite('ControlObjectsFilePersistence', ()=> {
    let persistence: ControlObjectsFilePersistence;
    let fixture: ControlObjectsPersistenceFixture;
    
    setup((done) => {
        persistence = new ControlObjectsFilePersistence('./data/control_objects.test.json');

        fixture = new ControlObjectsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});