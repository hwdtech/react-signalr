import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  CounterConnectionContext,
  InvalidConnectionContext
} from './connections';
import StreamSampleResult from './StreamSampleResult';
import StreamSideEffectResult from './StreamSideEffectResult';

const CounterSubscriber = CounterConnectionContext.createStreamSubscriber(
  'ObservableCounter',
  props => [props.count, props.delayInSeconds]
);

storiesOf('createConnectionContext', module)
  .add('Successful connect', () => (
    <CounterConnectionContext.Provider>
      <div>
        <CounterConnectionContext.Consumer>
          {({ connection }) => connection && 'Connected ✔️'}
        </CounterConnectionContext.Consumer>
      </div>
    </CounterConnectionContext.Provider>
  ))
  .add('Connection error', () => (
    <InvalidConnectionContext.Provider>
      <div>
        <InvalidConnectionContext.Consumer>
          {({ connectionError }) => connectionError && 'Connection failed ❌'}
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
