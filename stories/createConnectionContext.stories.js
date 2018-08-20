import React from 'react';
import { storiesOf } from '@storybook/react';
import { HubConnectionBuilder } from '@aspnet/signalr'
import createConnectionContext from '../lib/createConnectionContext';

const { Provider, Consumer } = createConnectionContext();

const createValidConnection = () => new HubConnectionBuilder()
  .withUrl('http://localhost:5000/hellohub')
  .build();

const createInvalidConnection = () => new HubConnectionBuilder()
  .withUrl('http://localhost:5000/hellohub1')
  .build();

storiesOf('createConnectionContext', module)
  .add('Successful connect', () => (
    <Provider createConnection={createValidConnection}>
      <div>
        <Consumer>
          {({ connection }) => connection && 'Connected ✔️'}
        </Consumer>
      </div>
    </Provider>
  ))
  .add('Connection error', () => (
    <Provider createConnection={createInvalidConnection}>
      <div>
        <Consumer>
          {({ connectionError }) => connectionError && 'Connection failed ❌'}
        </Consumer>
      </div>
    </Provider>
  ));

