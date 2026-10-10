import { TestBed } from '@angular/core/testing';
import { OriginBranch } from './origin-branch';

describe('OriginBranch', () => {
  let service: OriginBranch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OriginBranch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
