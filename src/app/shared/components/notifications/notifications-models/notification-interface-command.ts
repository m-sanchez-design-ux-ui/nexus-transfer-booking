import { INotification } from './notification-interface';

export interface INotificationCommand {
  operation: string;
  notification: INotification | undefined;
}