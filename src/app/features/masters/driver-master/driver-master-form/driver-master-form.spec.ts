import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverMasterForm } from './driver-master-form';

describe('DriverMasterForm', () => {
  let component: DriverMasterForm;
  let fixture: ComponentFixture<DriverMasterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverMasterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverMasterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
