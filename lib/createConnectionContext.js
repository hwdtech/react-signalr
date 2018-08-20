import React, { createContext, PureComponent } from 'react';

class ConnectionDisposer {
  constructor(connection) {
    this.originalConnection = connection;
  }

  start() {
    this._startAwaiter = this.originalConnection.start().then(() => this.originalConnection);
    return this._startAwaiter;
  }

  dispose() {
    return this._startAwaiter.then(conn => conn.stop());
  }
}

export default (createConnection) => {
  const { Provider, Consumer } = createContext();

  class ConnectionProvider extends PureComponent {
    state = {};

    async componentDidMount() {
      this._mounted = true;
      const createConn = createConnection || this.props.createConnection;

      this._disposer = new ConnectionDisposer(createConn());

      try {
        const conn = await this._disposer.start();
        if (this._mounted) {
          this.setState({ connection: conn });
        }
      } catch (e) {
        this._disposer = null;
        this.setState({ connectionError: e });
      }
    }

    async componentWillUnmount() {
      this._mounted = false;
      if (this._disposer) {
        await this._disposer.dispose();
      }
    }

    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>
    }
  }

  return {
    Provider: ConnectionProvider,
    Consumer
  };
}
