import {HubConnection, IStreamResult} from "@aspnet/signalr";
import {ComponentType, ConsumerProps, ReactElement, ReactNode} from "react";

export type StreamCreator<T> = (conn: HubConnection) => IStreamResult<T>;

export interface IConnectionStatus {
  connection: HubConnection | null;
  error: Error | null;
}

export interface IStreamSubscriptionState<T> {
  value: T | null;
  error: Error | null;
  done: boolean;
}

export interface IAutoProviderProps {
  children?: ReactNode;
}

export interface IConsumerProps {
  children?: (status: IConnectionStatus) => ReactElement<any>;
}

export interface IConnectionContext {
  Provider: ComponentType<IAutoProviderProps>;
  Consumer: ComponentType<ConsumerProps<IConnectionStatus>>;
}

export interface IStreamState<T> {
  error: Error | null;
  done: boolean;
  value: T | null;
}
