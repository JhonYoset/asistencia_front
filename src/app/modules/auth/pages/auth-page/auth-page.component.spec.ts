import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPageComponent } from './auth-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AuthPageComponent', () => {
  let component: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [AuthPageComponent]
    });
    fixture = TestBed.createComponent(AuthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return invalid form', () => {
    const mockCredential = {
      email : 'eee###F',
      password : "12345678"
    }
    const emailFormControl = component.formLogin.get('email');
    const passwordFormControl : any = component.formLogin.get('password');
    
    emailFormControl?.setValue(mockCredential.email)
    passwordFormControl?.setValue(mockCredential.password)

    expect(component.formLogin.invalid).toBeTrue()
  });

  it('should return valid form', () => {
    const mockCredential = {
      email : 'test@example.com',
      password : "ValidPassword12345"
    }
    const emailFormControl = component.formLogin.get('email');
    const passwordFormControl : any = component.formLogin.get('password');
    
    emailFormControl?.setValue(mockCredential.email)
    passwordFormControl?.setValue(mockCredential.password)

    expect(component.formLogin.valid).toBeTrue()
  });
});
