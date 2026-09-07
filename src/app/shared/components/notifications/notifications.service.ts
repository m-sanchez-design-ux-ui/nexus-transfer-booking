import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { INotification } from './notifications-models/notification-interface';
import { INotificationCommand } from './notifications-models/notification-interface-command';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly notificationSubject: Subject<INotificationCommand>;
  public notificationState: Observable<INotificationCommand>;

  constructor() {
    this.notificationSubject = new Subject<INotificationCommand>();
    this.notificationState = this.notificationSubject.asObservable();
  }

  public showAndClear(notification: INotification) {
    setTimeout(() => {
      this.show(notification);
    }, 300);

    setTimeout(() => {
      this.clear();
    }, 5000)
  }

  public show(notification: INotification) {
    this.notificationSubject.next({
      operation: 'show',
      notification
    });
  }

  public clear() {
    this.notificationSubject.next({
      operation: 'clear',
      notification: undefined
    });
  }
}
