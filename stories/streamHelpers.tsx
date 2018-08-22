import * as React from 'react';
import { PureComponent, SFC } from 'react';
import { IObservableSubscriberResult } from '../lib/ObservableSubscriber';

interface IProps<TValue> extends IObservableSubscriberResult<TValue> {
  onUpdate(r: IObservableSubscriberResult<TValue>): void;
}

export class StreamSideEffectResult<TValue> extends PureComponent<
  IProps<TValue>
> {
  componentDidUpdate() {
    const { value, error, done } = this.props;
    this.props.onUpdate({ value, done, error });
  }

  render() {
    return null;
  }
}

export const StreamSampleResult: SFC<IObservableSubscriberResult<number>> = (
  props: IObservableSubscriberResult<number>
) => {
  const { value, done, error } = props;

  if (done) {
    return <span>{value} done ✔</span>;
  }

  if (error) {
    return <span>Subscription error ❌</span>;
  }

  if (value || value === 0) {
    return <span>{value.toString()}</span>;
  }

  return <span>Connecting...</span>;
};
