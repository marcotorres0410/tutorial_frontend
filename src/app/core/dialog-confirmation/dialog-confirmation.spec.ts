import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmation } from './dialog-confirmation';

describe('DialogConfirmation', () => {
  let component: DialogConfirmation;
  let fixture: ComponentFixture<DialogConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
