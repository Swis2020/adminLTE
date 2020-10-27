import { Component, OnInit } from '@angular/core';
import { LocalApiService } from './local-api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-planaction',
  templateUrl: './planaction.component.html',
  styleUrls: ['./planaction.component.css'],
})
export class PlanactionComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: '';
  disabled = false;
  idAction: number;
  //set table haders names and data for our data Table
  displayedColumns: string[] = [
    'Mois',
    'ProblemAnalyse',
    'Massnahmen',
    'Verantwortlich',
    'Termin',
    'Abarbeitungsstatus',
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: any = [];
  dataCorrective: any = [];

  //Create form controls for modal
  mois = new FormControl('');
  problem = new FormControl('');
  mass = new FormControl('');
  veran = new FormControl('');
  termin = new FormControl('');
  abar = new FormControl('');

  constructor(private localApi: LocalApiService) {}

  ngOnInit(): void {
    this.loadActions();
  }

  // Get action list
  loadActions() {
    this.localApi.getActions('preventive').subscribe((data) => {
      //console.log(data);
      this.data = data;
    });
    this.localApi.getActions('corrective').subscribe((data) => {
      //console.log(data);
      this.dataCorrective = data;
    });
  }

  addRow(apiRoute) {
    let newAction = {
      id: null,
      Mois: this.mois.value,
      ProblemAnalyse: this.problem.value,
      Massnahmen: this.mass.value,
      Verantwortlich: this.veran.value,
      Termin: this.termin.value,
      Abarbeitungsstatus: this.labelPosition,
    };

    this.localApi.createAction(newAction, apiRoute).subscribe(() => {
      //refresh data table and reset data forms
      this.resetForms();
      this.loadActions();
      this.resetForms();
    });
  }
  // reset all formControl
  resetForms() {
    this.idAction = null;
    this.mois.reset();
    this.problem.reset();
    this.mass.reset();
    this.veran.reset();
    this.termin.reset();
    this.abar.reset();
    this.labelPosition = '';
  }

  //delete Action
  deleteAction(id, apiRoute) {
    this.localApi.deleteAction(id, apiRoute).subscribe(() => {
      this.loadActions();
    });
  }

  getIdAction(id) {
    this.idAction = id;
  }

  setProgressAction(apiRoute) {
    let action: any = [];
    if (apiRoute == '/update_action') {
      action = this.dataCorrective[this.idAction - 1];
      console.log(action);
    } else {
      action = this.data[this.idAction - 1];
      console.log(action);
    }

    action.Abarbeitungsstatus = this.labelPosition;
    console.log(this.idAction);

    this.localApi
      .updateAction(this.idAction, action, apiRoute)
      .subscribe(() => {
        //refresh data table and reset data forms
        this.loadActions();
        this.resetForms();
      });
  }

  getCurrentActionInformation(id, apiRoute) {
    this.idAction = id;
    let action: any = [];
    if (apiRoute == '/actions') {
      action = this.dataCorrective[this.idAction - 1];
      console.log(action);
    } else {
      action = this.data[this.idAction - 1];
      console.log(action);
    }

    this.mois.setValue(action.Mois);
    this.problem.setValue(action.ProblemAnalyse);
    this.mass.setValue(action.Massnahmen);
    this.termin.setValue(action.Termin);
    this.veran.setValue(action.Verantwortlich);
    this.labelPosition = action.Abarbeitungsstatus;
  }
  // update Action
  updateAction(apiRoute) {
    let newAction = {
      id: this.idAction,
      Mois: this.mois.value,
      ProblemAnalyse: this.problem.value,
      Massnahmen: this.mass.value,
      Verantwortlich: this.veran.value,
      Termin: this.termin.value,
      Abarbeitungsstatus: this.labelPosition,
    };
    this.localApi
      .updateAction(this.idAction, newAction, apiRoute)
      .subscribe(() => {
        //refresh data table and reset data forms
        this.resetForms();

        this.loadActions();
        this.resetForms();
      });
  }
}
