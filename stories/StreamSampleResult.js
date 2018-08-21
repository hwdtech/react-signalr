const StreamSampleResult = ({ value, error, done }) => {
  if (done) return `${value} done ✔`;
  if (error) return 'Subscription error ❌';

  if (value || value === 0) return value;
  return 'Connecting...';
};

export default StreamSampleResult;
