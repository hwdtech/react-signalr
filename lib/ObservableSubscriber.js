import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ObservableSubscriber extends PureComponent {
  static propTypes = {
    observable: PropTypes.shape({
      subscribe: PropTypes.func.isRequired
    }),
    children: PropTypes.func.isRequired
  };

  state = {};

  componentDidUpdate(prevProps) {
    if (prevProps.stream !== this.props.observable) {
      this._disposeSubscription();
      this._initSubscription();
    }
  }

  componentDidMount() {
    this._mounted = true;
    this._initSubscription();
  }

  componentWillUnmount() {
    this._disposeSubscription();
    this._mounted = false;
  }

  render() {
    return this.props.children(this.state);
  }

  _initSubscription() {
    const { observable } = this.props;

    if (!observable) {
      return;
    }

    this._subscription = observable.subscribe({
      next: value => this._safeSetState({ value }),
      complete: () => this._safeSetState({ done: true }),
      error: error =>
        this._safeSetState({ error, value: undefined, done: true })
    });
  }

  _disposeSubscription() {
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  _safeSetState(partialState) {
    if (this._mounted) {
      this.setState(partialState);
    }
  }
}
