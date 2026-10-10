import { TestBed } from '@angular/core/testing';
import { ClientMaster } from './client-master';

describe('ClientMaster', () => {
  let service: ClientMaster;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientMaster);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
