import {HubConnection} from "@aspnet/signalr";
import React, {createContext, useContext, useMemo} from "react";

import {
  IAutoProviderProps,
  IConnectionContext,
  IConnectionStatus,
  StreamCreator,
} from "./types";
import {useConnection} from "./useConnection";
import {useStream} from "./useStream";

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

  const useConnectionHook = () => useContext(context);

  return {
    Provider: AutoProvider,

    useConnection: useConnectionHook,

    useStream<T>(streamCreator: StreamCreator<T>, inputs: any[]) {
      const {connection} = useConnectionHook();
      const stream = useMemo(
        () => (connection ? streamCreator(connection) : null),
        [connection, ...inputs]
      );

      return useStream(stream);
    },
  };
};
