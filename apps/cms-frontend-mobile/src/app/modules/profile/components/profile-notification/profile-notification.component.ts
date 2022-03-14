import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-profile-notification',
  templateUrl: './profile-notification.component.html',
  styleUrls: ['./profile-notification.component.scss'],
})
export class ProfileNotificationComponent implements OnInit {
  notificationData = [
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
    {
      title: 'Notification Title',
      content: 'งบประมาณน้อย จะสู้คู่แข่งไม่ได้ = ไม่จริงเสมอไป เราจะมาเผยถึงวิธีสู้คู่แข่งที่งบเยอะกว่าแนะนำถึงหนทางทำ',
      dateTime: 'Oct-20-2020, 17:18',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
