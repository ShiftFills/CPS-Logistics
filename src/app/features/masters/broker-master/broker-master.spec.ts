import { TestBed } from '@angular/core/testing';
import { BrokerMaster } from './broker-master';

describe('BrokerMaster', () => {
  let service: BrokerMaster;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerMaster);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
