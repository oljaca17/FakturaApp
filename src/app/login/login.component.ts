import { parse } from 'path';
import { element } from 'protractor';
import { SignInData } from './../model/signInData';
import { AuthenticationService } from './../service/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isFormInvalid = false;
  areCredentialsInvalid = false;

  faktureList: Array<any> = [

  ];

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void{
    if(localStorage.getItem('isAuthenticated')!==null){
      this.authenticationService.setAuthenticated()
    }

    if(localStorage.getItem("fakture")!==null){
      const parsedData = localStorage.getItem("fakture") || "";
      const faktureList = JSON.parse(parsedData);
      const distinctNumbers:any = [];
      faktureList.forEach((element:any) => {
        if(!distinctNumbers.includes(element.broj)){
          distinctNumbers.push(element.broj);
        }

      });
      console.log(distinctNumbers);
      distinctNumbers.forEach((element:any) => {
        const filtered = faktureList.filter((item:any)=>item.broj===element);
        let iznosBezPdv = 0;
        let postoRabata = 0;
        let rabat = 0;
        let iznosSaRabatomBezPdv = 0;
        let pdv = 0;
        let ukupno = 0;
        let datum = "";
        let partner = "";
        filtered.forEach((element:any) => {
          iznosBezPdv += parseFloat(element.iznosBezPdv);
          postoRabata += parseFloat(element.postoRabata);
          rabat +=parseFloat(element.rabat);
          iznosSaRabatomBezPdv += parseFloat(element.iznosSaRabatomBezPdv);
          pdv += parseFloat(element.pdv);
          ukupno += parseFloat(element.ukupno);
          datum = element.datum;
          partner = element.partner;
        });
        this.faktureList.push({broj:element, datum, partner, iznosBezPdv, postoRabata, rabat, iznosSaRabatomBezPdv, pdv, ukupno})
      });

      }}


  onSubmit(signInForm: NgForm) {
    if(!signInForm.valid) {
      this.isFormInvalid = true;
      this.areCredentialsInvalid = false;
      return;
    }

      this.checkCredentials(signInForm);

  }

  private checkCredentials(signInForm: NgForm){
    const signInData = new SignInData(signInForm.value.email, signInForm.value.password);
    if(!this.authenticationService.authenticate(signInData)){
      this.isFormInvalid = false;
      this.areCredentialsInvalid = true;
    }
  }
}
