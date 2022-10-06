import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwDtComponent } from './tw-dt.component';

describe('TwDtComponent', () => {
  let component: TwDtComponent;
  let fixture: ComponentFixture<TwDtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwDtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwDtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
