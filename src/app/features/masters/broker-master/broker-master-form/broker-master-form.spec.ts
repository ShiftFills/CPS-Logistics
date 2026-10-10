import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrokerMasterForm } from './broker-master-form';

describe('BrokerMasterForm', () => {
  let component: BrokerMasterForm;
  let fixture: ComponentFixture<BrokerMasterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerMasterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerMasterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
