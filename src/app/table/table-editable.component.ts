import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'table-editable',
  templateUrl: './table-editable.component.html',
  styleUrls: ['./table-editable.component.scss'],
})
export class TableEditableComponent
 implements OnInit, OnDestroy {
  editField: string | undefined;
  personList: Array<any> = [

  ];
  currentId: number=0;
  brojFakture: number=0;

  updateList(id: number, property: string, event: any) {
    switch (property) {
      case 'postoRabata': {
        const tmp1 = this.calculateRabat(
          parseFloat(this.personList[id]['iznosBezPdv']),
          parseFloat(event.target.textContent)
        );
        this.personList[id]['rabat'] = tmp1;

        const tmp2 = this.calculateIznosSaRabatomBezPdv(
          parseFloat(this.personList[id]['iznosBezPdv']),
          parseFloat(tmp1)
        );
        this.personList[id]['iznosSaRabatomBezPdv'] = tmp2;

        const pdv = this.calculatePdv(parseFloat(tmp2));
        this.personList[id]['pdv'] = pdv;

        break;
      }

      case 'kolicina': {
        const iznosBezPdv = this.calculateIznosBezPdv(
          parseFloat(event.target.textContent),
          parseFloat(this.personList[id]['cijena'])
        );
        this.personList[id]['iznosBezPdv'] = iznosBezPdv;

        const tmp1 = this.calculateRabat(
          parseFloat(iznosBezPdv),
          parseFloat(this.personList[id]['postoRabata'])
        );
        this.personList[id]['rabat'] = tmp1;

        const tmp2 = this.calculateIznosSaRabatomBezPdv(
          parseFloat(iznosBezPdv),
          parseFloat(tmp1)
        );
        this.personList[id]['iznosSaRabatomBezPdv'] = tmp2;

        const pdv = this.calculatePdv(parseFloat(tmp2));
        this.personList[id]['pdv'] = pdv;

        break;
      }

      case 'cijena': {
        const iznosBezPdv = this.calculateIznosBezPdv(
          parseFloat(this.personList[id]['kolicina']),
          parseFloat(event.target.textContent)
        );
        this.personList[id]['iznosBezPdv'] = iznosBezPdv;

        const tmp1 = this.calculateRabat(
          parseFloat(iznosBezPdv),
          parseFloat(this.personList[id]['postoRabata'])
        );
        this.personList[id]['rabat'] = tmp1;

        const tmp2 = this.calculateIznosSaRabatomBezPdv(
          parseFloat(iznosBezPdv),
          parseFloat(tmp1)
        );
        this.personList[id]['iznosSaRabatomBezPdv'] = tmp2;

        const pdv = this.calculatePdv(parseFloat(tmp2));
        this.personList[id]['pdv'] = pdv;

        break;
      }
    }

    const ukupno = this.calculateUkupno(
      parseFloat(this.personList[id]['iznosSaRabatomBezPdv']),
      parseFloat(this.personList[id]['pdv'])
    );
    this.personList[id]['ukupno'] = ukupno;

    const editField = event.target.textContent;
    this.personList[id][property] = editField;
  }

  remove(id: any) {
     this.personList = this.personList.filter (item=>{
      return item.id!==id;
    });

  }

  add() {
    const noviUnos = {
      id: this.currentId++,
      kolicina: '0',
      cijena: '0',
      broj: this.brojFakture,
      datum: '-/-/-',
      partner: '',
      iznosBezPdv: '0',
      postoRabata: '0',
      rabat: '0',
      iznosSaRabatomBezPdv: '0',
      pdv: '0',
      ukupno: '0',

    };

    this.personList.push(noviUnos);
  }

  finish() {
    this.brojFakture++;
    localStorage.setItem("increment", "" + this.currentId);

    if(localStorage.getItem("fakture")!==null){
        const parsedData = localStorage.getItem("fakture") || "";
        this.personList = [...JSON.parse(parsedData), ...this.personList];
       }

    localStorage.setItem("fakture", JSON.stringify(this.personList));


    localStorage.setItem("brojFakture", "" + this.brojFakture);
    this.personList = [];

  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  calculateRabat(iznosBezPdv: number, rabatPosto: number) {
    const rabat = (iznosBezPdv * rabatPosto) / 100;
    return rabat.toFixed(2);
  }

  calculateIznosBezPdv(kolicina: number, cijena: number) {
    const iznosBezPdv = kolicina * cijena;
    return iznosBezPdv.toFixed(2);
  }

  calculateIznosSaRabatomBezPdv(iznosBezPdv: number, rabat: number) {
    const iznosSaRabatomBezPdv = iznosBezPdv - rabat;
    return iznosSaRabatomBezPdv.toFixed(2);
  }

  calculatePdv(iznosSaRabatomBezPdv: number) {
    const pdv = iznosSaRabatomBezPdv * 0.17;
    return pdv.toFixed(2);
  }

  calculateUkupno(iznosSaRabatomBezPdv: number, pdv: number) {
    const ukupno = iznosSaRabatomBezPdv + pdv;
    return ukupno.toFixed(2);
  }


  ngOnDestroy(){

  }

  ngOnInit(){
    if(localStorage.getItem("increment")==null){
      localStorage.setItem("increment", "560");
    }
    else{
      const currentId = (localStorage.getItem("increment")) || "";
      this.currentId = parseInt(currentId);
    }

    if(localStorage.getItem("brojFakture")==null){
      localStorage.setItem("brojFakture", "1");
      this.brojFakture = parseInt("1");
    }
    else{
      const brojFakture = (localStorage.getItem("brojFakture")) || "";
      this.brojFakture = parseInt(brojFakture);
    }


  }

}
