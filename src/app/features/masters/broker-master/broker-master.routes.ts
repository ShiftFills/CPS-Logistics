
import { Routes } from '@angular/router';
import { BrokerMasterList } from './broker-master-list/broker-master-list';
import { BrokerMasterForm } from './broker-master-form/broker-master-form';

export const BROKER_MASTER_ROUTES: Routes = [
  { path: '', component: BrokerMasterList },
  { path: 'new', component: BrokerMasterForm },
  { path: ':id/edit', component: BrokerMasterForm },
];
