import { ConfigParams } from 'pip-services3-commons-node';

import { ControlObjectsMemoryPersistence } from '../../src/persistence/ControlObjectsMemoryPersistence';
import { ControlObjectsPersistenceFixture } from './ControlObjectsPersistenceFixture';

suite('ControlObjectsMemoryPersistence', ()=> {
    let persistence: ControlObjectsMemoryPersistence;
    let fixture: ControlObjectsPersistenceFixture;
    
    setup((done) => {
        persistence = new ControlObjectsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new ControlObjectsPersistenceFixture(persistence);
        
        persistence.open(null, done);
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