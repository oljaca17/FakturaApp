import { SignInData } from './../../model/signInData';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

private readonly mockedUser = new SignInData('1', '1');
isAuthenticated = false;

  constructor(private router: Router) { }

  authenticate(SignInData: SignInData): boolean {
    if(this.checkCredentials(SignInData)){
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', "true");
      this.router.navigate(['home']);
      return true;
    }
    this.isAuthenticated = false;
    return false;
  }

  private checkCredentials(signInData: SignInData): boolean {
    return this.checkEmail(signInData.getEmail()) && this.checkPassword(signInData.getPassword());
  }

  private checkEmail(email: string): boolean {
    return email === this.mockedUser.getEmail();
  }

  private checkPassword(password: string): boolean {
    return password === this.mockedUser.getPassword();
  }
  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['']);
  }

  setAuthenticated(){
    this.isAuthenticated = true,
    this.router.navigate(['home'])
  }

}
