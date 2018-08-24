import {
  IStreamResult,
  IStreamSubscriber,
  ISubscription
} from '@aspnet/signalr';

export class Subject<T> implements IStreamResult<T> {
  public observers: Array<IStreamSubscriber<T>>;

  constructor() {
    this.observers = [];
  }

  public next(item: T): void {
    for (const observer of this.observers) {
      observer.next(item);
    }
  }

  public error(err: any): void {
    for (const observer of this.observers) {
      if (observer.error) {
        observer.error(err);
      }
    }
  }

  public complete(): void {
    for (const observer of this.observers) {
      if (observer.complete) {
        observer.complete();
      }
    }
  }

  public subscribe(observer: IStreamSubscriber<T>): ISubscription<T> {
    this.observers.push(observer);
    return {
      dispose: () => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
          this.observers.splice(index, 1);
        }
      }
    };
  }
}
