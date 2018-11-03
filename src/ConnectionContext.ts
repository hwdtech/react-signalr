import {ComponentType, ConsumerProps, Context} from "react";

import {
  IAutoProviderProps,
  IConnectionContext,
  IConnectionStatus,
} from "./types";

export class ConnectionContext implements IConnectionContext {
  public readonly Provider: ComponentType<IAutoProviderProps>;
  public readonly Consumer: ComponentType<ConsumerProps<IConnectionStatus>>;
  // tslint:disable-next-line:variable-name
  private readonly $__privateReactInternalContext: Context<IConnectionStatus>;

  constructor(
    AutoProvider: ComponentType<IAutoProviderProps>,
    Ctx: Context<IConnectionStatus>
  ) {
    this.Provider = AutoProvider;
    this.Consumer = Ctx.Consumer;
    this.$__privateReactInternalContext = Ctx;
  }
}
