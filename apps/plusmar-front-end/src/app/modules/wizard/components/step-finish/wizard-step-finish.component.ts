import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { EnumWizardStepType } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-wizard-step-finish',
  templateUrl: './wizard-step-finish.component.html',
  styleUrls: ['wizard-step-finish.component.scss'],
})
export class WizardStepFinishComponent implements OnInit {
  constructor(public pageService: PagesService) {}
  @Output() selectStep = new EventEmitter<EnumWizardStepType>();
  // Add translation
  steps = [
    {
      stepType: EnumWizardStepType.STEP_CONNECT_FACEBOOK,
      title: 'Step 1',
      details: 'Connect Facebook fanpage',
      imgUrl: 'assets/img/wizard/step-1-logo.png',
      active: true,
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
      active: true,
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
  ngOnInit(): void {}
  onStart(): void {
    window.location.href = environment.DEFAULT_ROUTE;
  }
}
