import {HubConnection} from "@aspnet/signalr";
import React, {createContext} from "react";

import {
  IAutoProviderProps,
  IConnectionContext,
  IConnectionStatus,
} from "./types";
import {useConnection} from "./useConnection";
import {ConnectionContext} from "./ConnectionContext";

export {useStream} from "./useStream";

export const createConnectionContext = (
  createConnection: () => HubConnection
): IConnectionContext => {
  const context = createContext<IConnectionStatus>({
    connection: null,
    error: null,
  });
  const {Provider} = context;

  function AutoProvider(props: IAutoProviderProps) {
    const connStatus = useConnection(createConnection);
    return <Provider value={connStatus}>{props.children}</Provider>;
  }

  return new ConnectionContext(AutoProvider, context);
};
