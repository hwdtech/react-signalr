import {HttpTransportType, HubConnectionBuilder} from "@aspnet/signalr";

import {createConnectionContext} from "../src";

const urlNamespace = "https://hw-signalr-counter.azurewebsites.net/";

export const CounterContext = createConnectionContext(() =>
  new HubConnectionBuilder()
    .withUrl(`${urlNamespace}counter`, HttpTransportType.WebSockets)
    .build()
);

export const InvalidContext = createConnectionContext(() =>
  new HubConnectionBuilder()
    .withUrl(`${urlNamespace}counter1`, HttpTransportType.WebSockets)
    .build()
);
