import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientMasterList } from './client-master-list';

describe('ClientMasterList', () => {
  let component: ClientMasterList;
  let fixture: ComponentFixture<ClientMasterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientMasterList],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientMasterList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
