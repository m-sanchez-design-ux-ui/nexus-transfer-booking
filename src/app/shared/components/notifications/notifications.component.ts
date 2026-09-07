import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { INotification } from './notifications-models/notification-interface';
import { INotificationCommand } from './notifications-models/notification-interface-command';
import { NotificationsService } from './notifications.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;
  private readonly subscriptionRouter!: Subscription;
  public notifications: INotification[];
  public isModalVisible = true;
  
  constructor(
    private readonly notificationsService: NotificationsService) {
    this.notifications = [];
  }

  ngOnInit() {
    this.subscription = this.notificationsService.notificationState.subscribe(state => {
      if (state.operation === 'show') {
        this.showNotification(state);
      } else if (state.operation === 'clear') {
        this.clearNotifications();
      }
    });
  }

  private clearNotifications() {
    this.notifications = [];

    this.isModalVisible = true;
  }

  private showNotification(state: INotificationCommand) {

    this.notifications = [state.notification!];
    if (state.notification!.timeout) {
      setTimeout(() => {
        this.notifications.splice(this.notifications.indexOf(state.notification!), 1);
      }, 10000);
      
      this.isModalVisible = false
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionRouter) {
      this.subscriptionRouter.unsubscribe();
    }
  }

}
