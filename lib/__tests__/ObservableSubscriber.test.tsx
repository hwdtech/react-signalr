import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { ObservableSubscriber } from '../ObservableSubscriber';
import { Subject } from './helpers/Subject';

afterEach(cleanup);

test('it should pass observable values to children function', () => {
  const subject = new Subject();
  const children = jest.fn().mockReturnValue(null);

  render(
    <ObservableSubscriber observable={subject}>{children}</ObservableSubscriber>
  );

  subject.next(1);
  expect(children).toHaveBeenCalledWith({ value: 1 });
});

test('it should pass done to children function', () => {
  const subject = new Subject();
  const children = jest.fn().mockReturnValue(null);

  render(
    <ObservableSubscriber observable={subject}>{children}</ObservableSubscriber>
  );

  subject.next(1);
  subject.complete();
  expect(children).toHaveBeenCalledWith({ value: 1, done: true });
});

test('it should pass error to children function', () => {
  const subject = new Subject();
  const children = jest.fn().mockReturnValue(null);

  render(
    <ObservableSubscriber observable={subject}>{children}</ObservableSubscriber>
  );

  subject.next(1);
  subject.error(new Error('Bam'));
  expect(children).toHaveBeenCalledWith({
    error: new Error('Bam'),
    done: true
  });
});

test('it should clean up on unmount', () => {
  const subject = new Subject();
  const children = jest.fn().mockReturnValue(null);

  const { unmount } = render(
    <ObservableSubscriber observable={subject}>{children}</ObservableSubscriber>
  );

  subject.next(1);
  unmount();
  subject.next(2);

  expect(children).not.toHaveBeenCalledWith({ value: 2 });
});
