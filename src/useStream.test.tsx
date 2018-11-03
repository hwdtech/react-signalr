import React from "react";
import {IStreamResult} from "@aspnet/signalr";
import {cleanup, render} from "react-testing-library";

import {Stream} from "../test-support/Stream";

import {useStream} from "./useStream";

function TestHook<T>(props: {
  stream: IStreamResult<T>;
  children: (s: ReturnType<typeof useStream>) => React.ReactElement<any>;
}) {
  return props.children(useStream(props.stream));
}

function fixture() {
  return {
    children: jest.fn().mockReturnValue(null),
    stream: new Stream<number>(),
  };
}

afterEach(cleanup);

test("should initialize with empty state", () => {
  const {children, stream} = fixture();
  render(<TestHook stream={stream}>{children}</TestHook>);
  expect(children).toHaveBeenCalledWith({
    value: null,
    error: null,
    done: false,
  });
});

test("should update value on stream value", () => {
  const {children, stream} = fixture();
  render(<TestHook stream={stream}>{children}</TestHook>);
  stream.next(1);
  expect(children).toHaveBeenCalledWith({
    value: 1,
    error: null,
    done: false,
  });
});

test("should set done on stream completion", () => {
  const {children, stream} = fixture();
  render(<TestHook stream={stream}>{children}</TestHook>);
  stream.complete();
  expect(children).toHaveBeenCalledWith({
    value: null,
    error: null,
    done: true,
  });
});

test("should set error & done on stream error", () => {
  const {children, stream} = fixture();
  render(<TestHook stream={stream}>{children}</TestHook>);
  stream.error(new Error("BAM"));
  expect(children).toHaveBeenCalledWith({
    value: null,
    error: new Error("BAM"),
    done: true,
  });
});

test("should dispose subscription on unmount", () => {
  const {children, stream} = fixture();
  const {unmount} = render(<TestHook stream={stream}>{children}</TestHook>);
  unmount();
  stream.next(1);
  expect(children).not.toHaveBeenCalledWith({
    value: 1,
    error: null,
    done: false,
  });
});
