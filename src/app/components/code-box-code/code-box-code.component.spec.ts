import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeBoxCodeComponent } from './code-box-code.component';

describe('CodeBoxCodeComponent', () => {
  let component: CodeBoxCodeComponent;
  let fixture: ComponentFixture<CodeBoxCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeBoxCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeBoxCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
