import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  CounterConnectionContext,
  InvalidConnectionContext
} from './connections';
import {
  StreamSideEffectResult,
  StreamSampleResult,
  ConnectionStatus
} from './helpers';

interface ICounterProps {
  count: number;
  delayInSeconds: number;
}

const CounterSubscriber = CounterConnectionContext.createStreamSubscriber<
  ICounterProps,
  number
>('ObservableCounter', (props: ICounterProps) => [
  props.count,
  props.delayInSeconds
]);

storiesOf('createConnectionContext', module)
  .add('Successful connect', () => (
    <CounterConnectionContext.Provider>
      <div>
        <CounterConnectionContext.Consumer>
          {value => <ConnectionStatus {...value} />}
        </CounterConnectionContext.Consumer>
      </div>
    </CounterConnectionContext.Provider>
  ))
  .add('Connection error', () => (
    <InvalidConnectionContext.Provider>
      <div>
        <InvalidConnectionContext.Consumer>
          {value => <ConnectionStatus {...value} />}
        </InvalidConnectionContext.Consumer>
      </div>
    </InvalidConnectionContext.Provider>
  ))
  .add('Stream subscription', () => (
    <CounterConnectionContext.Provider>
      <div>
        <CounterSubscriber count={5} delayInSeconds={1}>
          {result => <StreamSampleResult {...result} />}
        </CounterSubscriber>
      </div>
    </CounterConnectionContext.Provider>
  ))
  .add('Stream subscription w/ side effects', () => (
    <CounterConnectionContext.Provider>
      <div>
        <p>
          See the <strong>Action Logger</strong> section for updates
        </p>
        <CounterSubscriber count={5} delayInSeconds={1}>
          {result => (
            <StreamSideEffectResult
              {...result}
              onUpdate={action('[CounterSubscriber]: Update')}
            />
          )}
        </CounterSubscriber>
      </div>
    </CounterConnectionContext.Provider>
  ));
