import { Routes } from '@angular/router';
import { ClientMasterList } from './client-master-list/client-master-list';
import { ClientMasterForm } from './client-master-form/client-master-form';

export const CLIENT_MASTER_ROUTES: Routes = [
  { path: '', component: ClientMasterList },
  { path: 'new', component: ClientMasterForm },
  { path: ':id/edit', component: ClientMasterForm },
];