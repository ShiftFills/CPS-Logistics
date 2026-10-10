import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnquiryQuotation } from './enquiry-quotation';

describe('EnquiryQuotation', () => {
  let component: EnquiryQuotation;
  let fixture: ComponentFixture<EnquiryQuotation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryQuotation],
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiryQuotation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
