import React, { createContext, PureComponent } from 'react';
import PropTypes from 'prop-types';
import ObservableSubscriber from './ObservableSubscriber';

class ConnectionDisposer {
  constructor(connection) {
    this.originalConnection = connection;
  }

  start() {
    this._startAwaiter = this.originalConnection
      .start()
      .then(() => this.originalConnection);
    return this._startAwaiter;
  }

  dispose() {
    return this._startAwaiter.then(conn => conn.stop());
  }
}

export default createConnection => {
  const { Provider, Consumer } = createContext();

  class ConnectionProvider extends PureComponent {
    static propTypes = {
      children: PropTypes.node.isRequired
    };

    state = {};

    async componentDidMount() {
      this._mounted = true;
      this._disposer = new ConnectionDisposer(createConnection());

      try {
        const conn = await this._disposer.start();
        this._safeSetState({ connection: conn });
      } catch (e) {
        this._disposer = null;
        this._safeSetState({ connectionError: e });
      }
    }

    async componentWillUnmount() {
      this._mounted = false;
      if (this._disposer) {
        await this._disposer.dispose();
      }
    }

    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }

    _safeSetState(partState) {
      if (this._mounted) {
        this.setState(partState);
      }
    }
  }

  const createStreamSubscriber = (streamName, mapPropsToArguments) => {
    const StreamSubscriberWrapper = ({ children, ...props }) => (
      <Consumer>
        {({ connection }) => (
          <ObservableSubscriber
            observable={
              connection
                ? connection.stream(
                    streamName,
                    ...(mapPropsToArguments(props) || [])
                  )
                : null
            }
          >
            {children}
          </ObservableSubscriber>
        )}
      </Consumer>
    );

    StreamSubscriberWrapper.propTypes = {
      children: PropTypes.func.isRequired
    };

    return StreamSubscriberWrapper;
  };

  return {
    Provider: ConnectionProvider,
    Consumer,
    createStreamSubscriber
  };
};
