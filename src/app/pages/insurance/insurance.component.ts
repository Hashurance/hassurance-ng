import { Component, OnInit } from '@angular/core';
import {FormMetadata} from "../../services/form/form.class";
import {Router} from "@angular/router";
import {FormService} from "../../services/form/form.service";
import {InsuranceService} from "../../services/insurance/insurance.service";
import {StateService} from "../../services/state/state.service";
import {MdSnackBar} from "@angular/material";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {

  private formMetadata: FormMetadata;

  constructor(
    private router: Router,
    private formService: FormService,
    private stateService: StateService,
	  private insuranceService: InsuranceService,
    private snackBar: MdSnackBar
  ) {}

  ngOnInit(): void {
    this.formMetadata = this.formService.get();

    if(this.formMetadata.uid1 == "") {
      this.router.navigateByUrl('/');
    }
  }

  submitContractRequest() {
    var that = this;
    var counter = 0;
    var callback = () => {
      if(counter >= 2) {
        console.log(JSON.stringify(that.formMetadata));

        this.formService.set(that.formMetadata);
        this.router.navigateByUrl('gp');
      }
    }

    this.stateService.generateUID(this.formMetadata.socialSecurityNumber).then(tx => {
      this.formMetadata.uid2 = tx.tx;
      counter ++;
      callback();
    }).catch(e => {
      console.log(JSON.stringify(e));
      this.snackBar.open(e.toString(), 'Close');
    })

    this.insuranceService.createContract(this.formMetadata.uid1).then((contractId) => {
      this.formMetadata.cid = contractId;
      counter ++;
      callback();
    }).catch(e => {
      console.log(JSON.stringify(e))
      this.snackBar.open(e.toString(), 'Close');
    });
  }
}
