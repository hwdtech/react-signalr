import { PureComponent, ReactNode } from 'react';
import { IStreamResult, ISubscription } from '@aspnet/signalr';

export interface IObservableSubscriberResult<TValue> {
  value?: TValue;
  error?: Error;
  done?: boolean;
}

interface Props<TValue> {
  observable: IStreamResult<TValue> | null;
  children: (result: IObservableSubscriberResult<TValue>) => ReactNode;
}

export class ObservableSubscriber<TValue> extends PureComponent<
  Props<TValue>,
  IObservableSubscriberResult<TValue>
> {
  private subscription: ISubscription<TValue> | undefined;

  state = {};

  componentDidUpdate(
    prevProps: Props<TValue>,
    prevState: IObservableSubscriberResult<TValue>
  ) {
    if (prevProps.observable !== this.props.observable) {
      this._disposeSubscription();
      this._initSubscription();
    }
  }

  componentDidMount() {
    this._initSubscription();
  }

  componentWillUnmount() {
    this._disposeSubscription();
  }

  render() {
    return this.props.children(this.state);
  }

  _initSubscription() {
    const { observable } = this.props;

    if (!observable) {
      return;
    }

    this.subscription = observable.subscribe({
      next: (value: TValue) => this.setState({ value }),
      complete: () => this.setState({ done: true }),
      error: (error: Error) =>
        this.setState({ error, value: undefined, done: true })
    });
  }

  _disposeSubscription() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }
}
