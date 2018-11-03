import {HttpTransportType, HubConnectionBuilder} from "@aspnet/signalr";

import {createConnectionContext} from "../src/createConnectionContext";

const urlNamespace = "https://hw-signalr-counter.azurewebsites.net/";

export const CounterContext = createConnectionContext(() =>
  new HubConnectionBuilder()
    .withUrl(`${urlNamespace}counter`, HttpTransportType.WebSockets)
    .build()
);

export const Invalid = createConnectionContext(() =>
  new HubConnectionBuilder()
    .withUrl(`${urlNamespace}counter1`, HttpTransportType.WebSockets)
    .build()
);
