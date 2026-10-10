import { TestBed } from '@angular/core/testing';
import { AssignLeadApi } from './assign-lead-api';

describe('AssignLeadApi', () => {
  let service: AssignLeadApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignLeadApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
