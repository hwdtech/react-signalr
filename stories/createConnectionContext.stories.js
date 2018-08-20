import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  ValidConnectionContext,
  InvalidConnectionContext
} from './connections';

storiesOf('createConnectionContext', module)
  .add('Successful connect', () => (
    <ValidConnectionContext.Provider>
      <div>
        <ValidConnectionContext.Consumer>
          {({ connection }) => connection && 'Connected ✔️'}
        </ValidConnectionContext.Consumer>
      </div>
    </ValidConnectionContext.Provider>
  ))
  .add('Connection error', () => (
    <InvalidConnectionContext.Provider>
      <div>
        <InvalidConnectionContext.Consumer>
          {({ connectionError }) => connectionError && 'Connection failed ❌'}
        </InvalidConnectionContext.Consumer>
      </div>
    </InvalidConnectionContext.Provider>
  ));
