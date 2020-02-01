import React from "react";
import ReactDOM from "react-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {
  useStream,
  StreamState,
  ConnectionProvider
} from "@hwdtech/react-signalr";

const conn = new HubConnectionBuilder()
  .withUrl("https://localhost:5001/counter")
  .configureLogging(LogLevel.Trace)
  .withAutomaticReconnect()
  .build();

const streamFn = connection => connection.stream("count");

function Consumer() {
  const { data, error, state } = useStream<number>(streamFn);

  if (state === StreamState.Error) {
    return <span>No way, ;( {error.message}</span>;
  }

  if (state === StreamState.Connecting) {
    return <span>Hold on a sec...</span>;
  }

  if (state === StreamState.Awaiting) {
    return <span>Almost there...</span>;
  }

  if (state === StreamState.Active) {
    return <span>Reading data: {data}...</span>;
  }

  if (state === StreamState.Completed) {
    return <span>Last chunk: {data}. I am done, bye</span>;
  }

  return <span>Waat?</span>;
}

const App = () => {
  return (
    <ConnectionProvider connection={conn}>
      <Consumer />
    </ConnectionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
