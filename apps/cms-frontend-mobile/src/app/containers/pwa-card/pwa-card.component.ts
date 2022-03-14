import { Component, HostListener, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-pwa-card',
  templateUrl: './pwa-card.component.html',
  styleUrls: ['./pwa-card.component.scss'],
  animations: [FadeAnimate.fadeInOutYAnimation],
})
export class PwaCardComponent implements OnInit {
  pwaCardStatus = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deferredPrompt: any;
  currentDate: number;

  constructor() {}

  ngOnInit(): void {}

  onDismiss(): void {
    this.pwaCardStatus = false;
    this.currentDate = new Date().getDate();
    window.localStorage.setItem('cardShowDate', this.currentDate.toString());
  }

  onNotNow(): void {
    this.pwaCardStatus = false;
    this.currentDate = new Date().getDate();
    window.localStorage.setItem('cardShowDate', this.currentDate.toString());
  }

  onIgnore(): void {
    this.pwaCardStatus = false;
    this.currentDate = 0;
    window.localStorage.setItem('cardShowDate', this.currentDate.toString());
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event): void {
    const savedDate = window.localStorage.getItem('cardShowDate');
    this.currentDate = new Date().getDate();
    if (!savedDate || this.currentDate !== +savedDate) {
      setTimeout(() => {
        //console.log(e);
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        this.pwaCardStatus = true;
      }, 10000);
    }
  }

  addToHomeScreen(): void {
    // hide our user interface that shows our A2HS button
    this.pwaCardStatus = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        //console.log('User accepted the A2HS prompt');
      } else {
        //console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }
}
