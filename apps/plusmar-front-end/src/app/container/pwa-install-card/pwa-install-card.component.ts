import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'reactor-room-pwa-install-card',
  templateUrl: './pwa-install-card.component.html',
  styleUrls: ['./pwa-install-card.component.scss'],
  animations: [
    trigger('fadeOutIn', [
      transition(':enter', [style({ opacity: 0, right: '-100%' }), animate('300ms', style({ opacity: 1, right: '*' }))]),
      transition(':leave', [animate('100ms', style({ opacity: 0, right: '-100%' }))]),
    ]),
  ],
})
export class PwaInstallCardComponent implements OnInit {
  deferredPrompt: any;
  showCard = false;
  currentDate: number;
  updateMode = false;
  alertText = 'New version of Service Worker available, Please update.';
  constructor(private updates: SwUpdate) {}

  ngOnInit(): void {
    this.onUpdateAvaliable();
    this.onUpdateAcativated();
  }

  onUpdateAvaliable(): void {
    this.updates.available.subscribe((event) => {
      console.log('available version is', event.available);
      console.log('current version is', event.current);
      this.showCard = true;
      this.updateMode = true;
    });
  }

  onTriggerUpdate(): void {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
  onUpdateAcativated(): void {
    this.updates.activated.subscribe((event) => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  onDismiss(): void {
    this.showCard = false;
    this.currentDate = getUTCDayjs().toDate().getDate();
    window.localStorage.setItem('cardShowDate', this.currentDate.toString());
  }

  onNotNow(): void {
    this.showCard = false;
    this.currentDate = getUTCDayjs().toDate().getDate();
    window.localStorage.setItem('cardShowDate', this.currentDate.toString());
  }

  onIgnore(): void {
    this.showCard = false;
    this.currentDate = 0;
    window.localStorage.setItem('cardShowDate', this.currentDate.toString());
  }

  outsideEvent(event: any): void {
    if (event) {
      this.showCard = false;
      this.currentDate = getUTCDayjs().toDate().getDate();
      window.localStorage.setItem('cardShowDate', this.currentDate.toString());
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    const savedDate = window.localStorage.getItem('cardShowDate');
    this.currentDate = getUTCDayjs().toDate().getDate();
    if (!savedDate || this.currentDate !== +savedDate) {
      setTimeout(() => {
        //console.log(e);
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        this.showCard = true;
        this.updateMode = false;
      }, 3000);
    }
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showCard = false;
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
