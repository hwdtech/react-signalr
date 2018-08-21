import { HubConnectionBuilder } from '@aspnet/signalr';
import createConnectionContext from '../lib/createConnectionContext';

const urlNamespace = 'http://localhost:5000/';

const createValidConnection = () =>
  new HubConnectionBuilder().withUrl(`${urlNamespace}counter`).build();

const createInvalidConnection = () =>
  new HubConnectionBuilder().withUrl(`${urlNamespace}counter1`).build();

export const CounterConnectionContext = createConnectionContext(
  createValidConnection
);
export const InvalidConnectionContext = createConnectionContext(
  createInvalidConnection
);
