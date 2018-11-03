import {HubConnection} from "@aspnet/signalr";
import {useEffect, useReducer} from "react";
import {IConnectionStatus} from "types";

const reducer = (
  state: IConnectionStatus,
  partialState: Partial<IConnectionStatus>
) => ({...state, ...partialState});

const initialState = {
  connection: null,
  error: null,
};

export function useConnection(createConnection: () => HubConnection) {
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    const connection = createConnection();
    connection
      .start()
      .then(() => setState({connection}))
      .catch(error => setState({error}));

    return () => {
      connection.stop();
    };
  }, [createConnection]);

  return state;
}
