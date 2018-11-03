import {storiesOf} from "@storybook/react";
import React from "react";
import {IConnectionContext} from "types";

import {useConnectionContext} from "../src/useConnectionContext";

import {CounterContext, Invalid} from "./connections";

const createStatusWithContext = (
  ctx: IConnectionContext
) => (): React.ReactElement<{}> => {
  const {connection, error} = useConnectionContext(ctx);
  if (error) {
    return <>Connection error ❌</>;
  }
  if (connection) {
    return <>Connected ✔</>;
  }
  return <>Connecting...</>;
};

const SuccessfulStatus = createStatusWithContext(CounterContext);
const FailedStatus = createStatusWithContext(Invalid);

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
      <Invalid.Provider>
        <div>
          <FailedStatus />
        </div>
      </Invalid.Provider>
    );
  });
