# React SignalR helper components

[![npm version](https://badge.fury.io/js/%40hwdtech%2Freact-signalr.svg)](https://badge.fury.io/js/%40hwdtech%2Freact-signalr)

This package exposes a set of utility components to work with SignalR hub connections and streams. [Storybook demo](https://hwdtech.github.io/react-signalr)

## Installation

```bash
npm install @hwdtech/react-signalr
```

## SignalR hub connections

Managing connections ins't easy, you have always to keep in mind when they should be closed, to prevent memory leaks and unnecessary resource allocations. React components on the other hand provide 2 useful lifecycle hooks: `componentDidMount` and `componentWillUnmount` and these can be used to open and close underlying connections, so they can be used as disposable wrapper. This library utilizes this approach and provides a declarative way to open/close hub connections and uses [React context API](https://reactjs.org/docs/context.html)

### Simplified usage example

```js
import { HubConnectionBuilder } from '@aspnet/signalr';
import { createConnectionContext } from '@hwdtech/react-signalr/dist/createConnectionContext';

const createHubConnection = () => {
  /* build a connection instance here, for example */
  return new HubConnectionBuilder().withUrl('/chathub').build();
};

const { Provider, Consumer } = createConnectionContext(createHubConnection);

/* later in the code */

<Provider>
  <div>
    {/* somewhere deep in the application tree */}
    <Consumer>
      {({ connection, connectionError }) => {
        if (connection) return 'Connected!';
        if (connectionError) return 'Connection failed!';
        return 'Connecting...';
      }}
    </Consumer>
  </div>
</Provider>;
```

When `Provider` component is mounted it attempts to open a connection the `createHubConnection` factory return. When `Provider` component is unmounted it attempt to close the connection it opened previously.

Since the `Consumer` takes only children function as property you can create your own component that will handle connection side effects ([see example story](https://hwdtech.github.io/react-signalr/?selectedKind=createConnectionContext&selectedStory=Stream%20subscription%20w%2F%20side%20effects))

## SignalR streams
