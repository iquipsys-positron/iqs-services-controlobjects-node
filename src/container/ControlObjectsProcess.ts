import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { DevicesClientFactory } from 'iqs-clients-devices-node';
import { ObjectGroupsClientFactory } from 'iqs-clients-objectgroups-node';
import { ZonesClientFactory } from 'iqs-clients-zones-node';
import { EventRulesClientFactory } from 'iqs-clients-eventrules-node';

import { ControlObjectsServiceFactory } from '../build/ControlObjectsServiceFactory';

export class ControlObjectsProcess extends ProcessContainer {

    public constructor() {
        super("control_objects", "Controlled objects microservice");
        this._factories.add(new ControlObjectsServiceFactory);
        this._factories.add(new DevicesClientFactory);
        this._factories.add(new ObjectGroupsClientFactory);
        this._factories.add(new ZonesClientFactory);
        this._factories.add(new EventRulesClientFactory);
        this._factories.add(new DefaultRpcFactory);
    }


}
