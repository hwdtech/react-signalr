import { HubConnectionBuilder } from '@aspnet/signalr'
import createConnectionContext from '../lib/createConnectionContext';

const urlNamespace = 'https://signalr-sample.herokuapp.com/'

const createValidConnection = () => new HubConnectionBuilder()
  .withUrl(`${urlNamespace}hellohub`)
  .build();

const createInvalidConnection = () => new HubConnectionBuilder()
  .withUrl(`${urlNamespace}hellohub1`)
  .build();

export const ValidConnectionContext = createConnectionContext(createValidConnection);
export const InvalidConnectionContext = createConnectionContext(createInvalidConnection);
