
import { Routes } from '@angular/router';
import { DriverMasterList } from './driver-master-list/driver-master-list';
import { DriverMasterForm } from './driver-master-form/driver-master-form';

export const DRIVER_MASTER_ROUTES: Routes = [
  { path: '', component: DriverMasterList },
  { path: 'new', component: DriverMasterForm },
  { path: ':id/edit', component: DriverMasterForm },
];