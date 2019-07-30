import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeBoxTextareaComponent } from './code-box-textarea.component';

describe('CodeBoxTextareaComponent', () => {
  let component: CodeBoxTextareaComponent;
  let fixture: ComponentFixture<CodeBoxTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeBoxTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeBoxTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
