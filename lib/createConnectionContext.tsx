import React, {
  ComponentClass,
  createContext,
  PureComponent,
  ReactNode
} from 'react';
import { HubConnection } from '@aspnet/signalr';
import {
  ObservableSubscriber,
  IObservableSubscriberResult
} from './ObservableSubscriber';

class ConnectionDisposer {
  private readonly originalConnection: HubConnection;

  private startAwaiter: Promise<HubConnection> | undefined;

  constructor(connection: HubConnection) {
    this.originalConnection = connection;
  }

  start() {
    this.startAwaiter = this.originalConnection
      .start()
      .then(() => this.originalConnection);

    return this.startAwaiter;
  }

  async dispose() {
    if (this.startAwaiter) {
      const conn = await this.startAwaiter;

      await conn.stop();
    }
  }
}

export interface IConnectionStatus {
  connection?: HubConnection;
  connectionError?: Error;
}

export const createConnectionContext = (
  createConnection: () => HubConnection
) => {
  const { Provider, Consumer } = createContext<IConnectionStatus>({});

  function createStreamSubscriber<TProps, TValue>(
    streamName: string,
    mapPropsToArguments: (props: TProps) => any[]
  ) {
    return function StreamSubscriberWrapper(
      props: TProps & {
        children: (r: IObservableSubscriberResult<TValue>) => ReactNode;
      }
    ) {
      const createStream = (connection?: HubConnection) =>
        connection
          ? connection.stream(streamName, ...(mapPropsToArguments(props) || []))
          : null;

      return (
        <Consumer>
          {({ connection }) => (
            <ObservableSubscriber observable={createStream(connection)}>
              {props.children}
            </ObservableSubscriber>
          )}
        </Consumer>
      );
    };
  }

  class ConnectionProvider extends PureComponent<
    { children: ReactNode },
    IConnectionStatus
  > {
    state = {};
    private mounted = false;
    private disposer: ConnectionDisposer | null;

    async componentDidMount() {
      this.mounted = true;
      this.disposer = new ConnectionDisposer(createConnection());

      try {
        const conn = await this.disposer.start();
        if (this.mounted) {
          this.setState({ connection: conn });
        }
      } catch (e) {
        this.disposer = null;
        if (this.mounted) {
          this.setState({ connectionError: e });
        }
      }
    }

    async componentWillUnmount() {
      this.mounted = false;
      if (this.disposer) {
        await this.disposer.dispose();
      }
    }

    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }
  }

  return {
    Provider: ConnectionProvider as ComponentClass<{ children: ReactNode }>,
    Consumer,
    createStreamSubscriber
  };
};
