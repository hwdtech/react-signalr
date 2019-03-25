import {storiesOf} from "@storybook/react";
import React from "react";
import {IConnectionContext} from "types";

import {
  CounterContext,
  InvalidContext,
} from "../test-support/connectionContextFixtures";

const createStatusWithContext = (
  ctx: IConnectionContext
) => (): React.ReactElement<{}> => {
  const {connection, error} = ctx.useConnection();
  if (error) {
    return <>Connection error ❌</>;
  }
  if (connection) {
    return <>Connected ✔</>;
  }
  return <>Connecting...</>;
};

const SuccessfulStatus = createStatusWithContext(CounterContext);
const FailedStatus = createStatusWithContext(InvalidContext);

storiesOf("Connection status", module)
  .add("Successful connect", () => {
    return (
      <CounterContext.Provider>
        <div>
          <SuccessfulStatus />
        </div>
      </CounterContext.Provider>
    );
  })
  .add("Connection error", () => {
    return (
      <InvalidContext.Provider>
        <div>
          <FailedStatus />
        </div>
      </InvalidContext.Provider>
    );
  });
