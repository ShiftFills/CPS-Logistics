import { Routes } from '@angular/router';

export const MASTERS_ROUTES: Routes = [
  {
    path: 'origin-branch',
    loadChildren: () =>
      import('./origin-branch/origin-branch.routes').then(m => m.ORIGIN_BRANCH_ROUTES),
  },
  {
    path: 'client-master',
    loadChildren: () =>
      import('./client-master/client-master.routes').then(m => m.CLIENT_MASTER_ROUTES),
  },
  {
    path: 'broker-master',
    loadChildren: () =>
      import('./broker-master/broker-master.routes').then(m => m.BROKER_MASTER_ROUTES),
  },

  {
    path: 'driver-master',
    loadChildren: () =>
      import('./driver-master/driver-master.routes').then(m => m.DRIVER_MASTER_ROUTES),
  },
];