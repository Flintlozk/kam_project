import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumWizardStepType } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-wizard-steps',
  templateUrl: './wizard-steps.component.html',
  styleUrls: [],
})
export class WizardStepsComponent implements OnInit {
  constructor() {}
  @Output() selectStep = new EventEmitter<EnumWizardStepType>();
  @Input() currentStep: EnumWizardStepType;
  // Add translation
  stepDetail;

  steps = [
    {
      stepType: EnumWizardStepType.STEP_CONNECT_FACEBOOK,
      title: 'Step 1',
      details: 'Connect Facebook fanpage',
      imgUrl: 'assets/img/wizard/step-1-logo.png',
      active: false,
      button: 'Connect...',
    },
    {
      stepType: EnumWizardStepType.STEP_SET_SHOP_INFO,
      title: 'Step 2',
      details: 'Shop Owner',
      imgUrl: 'assets/img/wizard/step-2-logo.png',
      active: false,
      button: 'Setting...',
    },
    {
      stepType: EnumWizardStepType.STEP_SET_LOGISTIC,
      title: 'Step 3',
      details: 'Logistic',
      imgUrl: 'assets/img/wizard/step-3-logo.png',
      active: false,
      button: 'Setting...',
    },
    {
      stepType: EnumWizardStepType.STEP_SET_PAYMENT,
      title: 'Step 4',
      details: 'Payment',
      imgUrl: 'assets/img/wizard/step-4-logo.png',
      active: false,
      button: 'Setting...',
    },
  ];

  stepDetails = [
    {
      title: 'Step 1',
      details: 'Connect Facebook fanpage',
      imgUrl: 'assets/img/wizard/step-1-logo.png',
      active: false,
    },
    {
      title: 'Step 2',
      details: 'Shop Owner',
      imgUrl: 'assets/img/wizard/step-2-logo.png',
      active: false,
    },
    {
      title: 'Step 3',
      details: 'Logistic',
      imgUrl: 'assets/img/wizard/step-3-logo.png',
      active: false,
    },
    {
      title: 'Step 4',
      details: 'Payment',
      imgUrl: 'assets/img/wizard/step-4-logo.png',
      active: false,
    },
  ];
  ngOnInit(): void {
    this.getStepDetails(this.currentStep);
    this.updateActiveSteps(this.currentStep);
  }

  updateActiveSteps(step: EnumWizardStepType): void {
    switch (step) {
      case EnumWizardStepType.CMS_DEFAULT:
      case EnumWizardStepType.STEP_CONNECT_FACEBOOK:
        break;
      case EnumWizardStepType.STEP_SET_SHOP_INFO:
        this.steps[0].active = true;
        break;
      case EnumWizardStepType.STEP_SET_LOGISTIC:
        this.steps[0].active = true;
        this.steps[1].active = true;
        break;
      case EnumWizardStepType.STEP_SET_PAYMENT:
        this.steps[0].active = true;
        this.steps[1].active = true;
        this.steps[2].active = true;
        break;
      default:
        this.steps[0].active = true;
        this.steps[1].active = true;
        this.steps[2].active = true;
        this.steps[3].active = true;
        break;
    }
  }

  getStepDetails(step: EnumWizardStepType): void {
    switch (step) {
      case EnumWizardStepType.CMS_DEFAULT:
      case EnumWizardStepType.STEP_CONNECT_FACEBOOK:
        this.stepDetail = {
          title: 'Step 1: Connect Facebook fanpage',
          detail: 'Connect your facebook fanpage for using More-Commerce services',
          imgUrl: 'assets/img/wizard/step-1.png',
        };
        break;
      case EnumWizardStepType.STEP_SET_SHOP_INFO:
        this.stepDetail = {
          title: 'Step 2: Shop Owner',
          detail: 'Enter your shop owner info for using Receipts, Shipping label',
          imgUrl: 'assets/img/wizard/step-2.png',
        };
        break;
      case EnumWizardStepType.STEP_SET_LOGISTIC:
        this.stepDetail = {
          title: 'Step 3: Logistic',
          detail: 'Select Logistics for serving your customers',
          imgUrl: 'assets/img/wizard/step-3.png',
        };
        break;
      case EnumWizardStepType.STEP_SET_PAYMENT:
        this.stepDetail = {
          title: 'Step 4: Payment',
          detail: 'Select Payments for serving your customers',
          imgUrl: 'assets/img/wizard/step-4.png',
        };
        break;
      default:
        break;
    }
  }
}
