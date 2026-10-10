import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [

  // Default route → Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Login page
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  // Protected application layout
  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: 'marketing-dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'leads',
        loadChildren: () =>
          import('./features/leads/leads.routes')
            .then(m => m.routes)
      },
      {
        path: 'create-lead',
        loadComponent: () =>
          import('./features/leads/create-lead/create-lead/create-lead')
            .then(m => m.CreateLead)
      },
      {
        path: 'assign-lead',
        loadComponent: () =>
          import('./features/leads/assign-lead/assign-lead')
            .then(m => m.AssignLead)
      },
      {
        path: 'masters',
        loadChildren: () =>
          import('./features/masters/masters.routes').then(m => m.MASTERS_ROUTES),
      },
         {
        path: 'enquiry-quotation',
        loadComponent: () =>
          import('./features/enquiry-quotation/enquiry-quotation')
            .then(m => m.EnquiryQuotation)
      }
    ]
  },

  // Unknown URL
  {
    path: '**',
    redirectTo: 'login'
  }
];


