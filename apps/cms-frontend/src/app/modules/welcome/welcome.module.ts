import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { WelcomeRoutingModule } from './welcome.routing';
import { WelcomeIntroModule } from './components/welcome-intro/welcome-intro.module';
import { WelcomeFeaturesModule } from './components/welcome-features/welcome-features.module';
import { WelcomeTemplatesModule } from './components/welcome-templates/welcome-templates.module';
import { LanguageSwitchModule } from '../../components/language-switch/language-switch.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [CommonModule, WelcomeRoutingModule, WelcomeIntroModule, WelcomeFeaturesModule, WelcomeTemplatesModule, LanguageSwitchModule, MatSnackBarModule],
  exports: [WelcomeComponent],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
})
export class WelcomeModule {}
