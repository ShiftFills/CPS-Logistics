import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrokerMasterList } from './broker-master-list';

describe('BrokerMasterList', () => {
  let component: BrokerMasterList;
  let fixture: ComponentFixture<BrokerMasterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerMasterList],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerMasterList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
