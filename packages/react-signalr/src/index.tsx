import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  IStreamResult,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";

export enum StreamState {
  Connecting,
  Error,
  Completed,
  Awaiting,
  Active,
}

const ctx = createContext<HubConnection | void>(undefined);

export const ConnectionProvider = (props: {
  connection: HubConnection;
  children: ReactNode;
}) => {
  const { connection, children } = props;
  const [active, setActive] = useState(() =>
    connection.state === HubConnectionState.Connected ? connection : undefined
  );

  useEffect(() => connection.onclose(() => setActive(undefined)), [connection]);
  useEffect(() => {
    if (connection.state !== HubConnectionState.Connected) {
      connection.start().then(() => setActive(connection));

      return () => {
        connection.stop();
      };
    }

    return () => {};
  }, [connection]);

  return <ctx.Provider value={active}>{children}</ctx.Provider>;
};

export function useStream<TValue>(
  streamFn: (c: HubConnection) => IStreamResult<TValue>
) {
  const [data, setData] = useState();
  const [error, setError] = useState<Error | undefined>();
  const [state, setState] = useState<StreamState>(StreamState.Connecting);
  const conn = useContext(ctx);

  useEffect(() => {
    if (!conn || conn.state !== HubConnectionState.Connected) {
      return () => {};
    }

    try {
      const stream = streamFn(conn);
      const sub = stream.subscribe({
        next: d => {
          setData(d);
          setState(StreamState.Active);
        },
        error: e => {
          setState(StreamState.Error);
          setError(e);
        },
        complete: () => {
          setState(StreamState.Completed);
        },
      });

      setState(StreamState.Awaiting);

      return () => sub.dispose();
    } catch (err) {
      setState(StreamState.Error);
      setError(err);
    }

    return () => {};
  }, [streamFn, conn]);

  return {
    data,
    error,
    state,
  };
}
