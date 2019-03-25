import {IStreamResult} from "@aspnet/signalr";
import {useEffect, useReducer} from "react";

import {IStreamState} from "./types";

// tslint:disable-next-line:no-empty
const noop = () => {};

type StreamStateUpdate<T> = Partial<IStreamState<T>>;

function stateReducer<T>(
  state: IStreamState<T>,
  action: StreamStateUpdate<T>
): IStreamState<T> {
  return {...state, ...action};
}

export function useStream<T>(stream: IStreamResult<T> | null): IStreamState<T> {
  const initialState: IStreamState<T> = {
    error: null,
    value: null,
    done: false,
  };

  const [state, setState] = useReducer(stateReducer, initialState);

  useEffect(() => {
    if (!stream) {
      return noop;
    }

    const sub = stream.subscribe({
      complete: () => setState({done: true}),
      error: err => setState({error: err, done: true}),
      next: streamValue => setState({value: streamValue}),
    });

    return () => {
      try {
        sub.dispose();
      } catch (_) {
        // Looks like react fire unmount event starting from the root components to children. This causes connection
        // to be closed first, and unsubscribe attempt above will eventually fail. But if the connection was already
        // closed that means we can handle this error with a noop
      }
    };
  }, [stream, setState]);

  // TODO: resolve why type reference doesn't work as expected
  return state as IStreamState<T>;
}
