import { HubConnectionBuilder } from '@aspnet/signalr'
import createConnectionContext from '../lib/createConnectionContext';

const createValidConnection = () => new HubConnectionBuilder()
  .withUrl('http://localhost:5000/hellohub')
  .build();

const createInvalidConnection = () => new HubConnectionBuilder()
  .withUrl('http://localhost:5000/hellohub1')
  .build();

export const ValidConnectionContext = createConnectionContext(createValidConnection);
export const InvalidConnectionContext = createConnectionContext(createInvalidConnection);
