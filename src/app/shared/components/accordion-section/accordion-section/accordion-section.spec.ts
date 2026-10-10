import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionSection } from './accordion-section';

describe('AccordionSection', () => {
  let component: AccordionSection;
  let fixture: ComponentFixture<AccordionSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionSection],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
