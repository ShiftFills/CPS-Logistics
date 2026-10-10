import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientMasterForm } from './client-master-form';

describe('ClientMasterForm', () => {
  let component: ClientMasterForm;
  let fixture: ComponentFixture<ClientMasterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientMasterForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientMasterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
