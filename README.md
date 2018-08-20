# React SignalR helper components

This package exposes a set of utility components to work with SignalR connections and hubs. [Storybook demo](https://hwdtech.github.io/react-signalr)

## SignalR hub connections

`createConnectionContext` is a utility that helps you create, open and compose SignalR hub connections

### Usage

See `stories/createConnectionContext.stories.js` for code samples.

```js
import { render } from 'react-dom';
import { HubConnectionBuilder } from '@aspnet/signalr';
import createConnectionContext from '@hwdtech/react-signalr/dist/createConnectionContext';

const { Provider, Consumer } = createConnectionContext(() => new HubConnectionBuilder().withUrl('insert hub url here').build());

render(
  <Provider>
    <div>
      {/* somewhere deep in the application */}
      <Consumer>
        {({ connection, connectionError }) => (
          /* connection (if present) will be already opened */
          /* connectionError indicates that connection was rejected */
        )}
      </Consumer>
    </div>
  </Provider>,
  document.getElementById('root');
);
```
