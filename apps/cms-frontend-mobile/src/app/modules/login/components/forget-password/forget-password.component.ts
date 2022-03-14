import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class ForgetPasswordComponent implements OnInit {
  passwordResetStatus = false;

  constructor() {}

  ngOnInit(): void {}

  onConfirmResetPassword(): void {
    this.passwordResetStatus = !this.passwordResetStatus;
  }
}
