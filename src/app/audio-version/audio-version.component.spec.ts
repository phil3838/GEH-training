import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioVersionComponent } from './audio-version.component';

describe('AudioVersionComponent', () => {
  let component: AudioVersionComponent;
  let fixture: ComponentFixture<AudioVersionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioVersionComponent]
    });
    fixture = TestBed.createComponent(AudioVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
