import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OriginBranchList } from './origin-branch-list';

describe('OriginBranchList', () => {
  let component: OriginBranchList;
  let fixture: ComponentFixture<OriginBranchList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OriginBranchList],
    }).compileComponents();

    fixture = TestBed.createComponent(OriginBranchList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
