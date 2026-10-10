import { Routes } from '@angular/router';
import { OriginBranchList } from './origin-branch-list/origin-branch-list';
import { OriginBranchForm } from './origin-branch-form/origin-branch-form';

export const ORIGIN_BRANCH_ROUTES: Routes = [
  { path: '', component: OriginBranchList },
  { path: 'new', component: OriginBranchForm },
  { path: ':id/edit', component: OriginBranchForm },
];