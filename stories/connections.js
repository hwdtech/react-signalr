import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import createConnectionContext from '../lib/createConnectionContext';

const urlNamespace = 'https://signalr-sample.herokuapp.com/';

const createValidConnection = () =>
  new HubConnectionBuilder()
    .withUrl(`${urlNamespace}counter`, HttpTransportType.WebSockets)
    .build();

const createInvalidConnection = () =>
  new HubConnectionBuilder()
    .withUrl(`${urlNamespace}counter1`, HttpTransportType.WebSockets)
    .build();

export const CounterConnectionContext = createConnectionContext(
  createValidConnection
);
export const InvalidConnectionContext = createConnectionContext(
  createInvalidConnection
);
