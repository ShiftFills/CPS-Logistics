import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverMasterList } from './driver-master-list';

describe('DriverMasterList', () => {
  let component: DriverMasterList;
  let fixture: ComponentFixture<DriverMasterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverMasterList],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverMasterList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
