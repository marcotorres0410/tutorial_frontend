import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanListPage } from './loan-list.page';

describe('LoanListPage', () => {
  let component: LoanListPage;
  let fixture: ComponentFixture<LoanListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
