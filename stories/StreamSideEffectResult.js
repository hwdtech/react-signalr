/* eslint-disable react/forbid-prop-types */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class StreamSideEffectResult extends PureComponent {
  static propTypes = {
    value: PropTypes.any,
    error: PropTypes.instanceOf(Error),
    done: PropTypes.bool,
    onUpdate: PropTypes.func.isRequired
  };

  componentDidUpdate() {
    const { value, error, done } = this.props;
    this.props.onUpdate({ value, done, error });
  }

  render() {
    return null;
  }
}

export default StreamSideEffectResult;
