import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameItem } from './game-item';

describe('GameItem', () => {
  let component: GameItem;
  let fixture: ComponentFixture<GameItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameItem],
    }).compileComponents();

    fixture = TestBed.createComponent(GameItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
