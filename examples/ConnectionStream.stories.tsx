import {action} from "@storybook/addon-actions";
import {storiesOf} from "@storybook/react";
import React from "react";

import {StreamCreator} from "../src/types";
import {useStream, useStreamCreator} from "../src";

import {CounterContext} from "./connections";

interface ICounterProps {
  count: number;
  delayInSeconds: number;
}

const effect = action("[CounterSubscriber]: Update");

function useStreamSubscription<T>(creator: StreamCreator<T>, inputs: any[]) {
  const stream = useStreamCreator<T>(CounterContext, creator, inputs);
  return useStream(stream);
}

storiesOf("Connection stream", module)
  .addDecorator(story => (
    <CounterContext.Provider>
      <div>{story()}</div>
    </CounterContext.Provider>
  ))
  .add("subscription", () => {
    function Subscriber(props: ICounterProps) {
      const streamState = useStreamSubscription<number>(
        conn =>
          conn.stream("ObservableCounter", props.count, props.delayInSeconds),
        [props.count, props.delayInSeconds]
      );

      const {value, error, done} = streamState;

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
    }

    return <Subscriber count={5} delayInSeconds={1} />;
  })
  .add("subscription w/ side effects", () => {
    function SubscriberWithEffects(props: ICounterProps) {
      const streamState = useStreamSubscription<number>(
        conn =>
          conn.stream("ObservableCounter", props.count, props.delayInSeconds),
        [props.count, props.delayInSeconds]
      );

      React.useEffect(() => {
        effect(streamState);
      }, [streamState.value, streamState.error, streamState.done]);

      return null;
    }

    return (
      <React.Fragment>
        <p>
          See the <strong>Action Logger</strong> section for updates
        </p>
        <SubscriberWithEffects count={5} delayInSeconds={1} />
      </React.Fragment>
    );
  });
