import {useContext} from "react";

import {IConnectionContext, IConnectionStatus} from "./types";

export function useConnectionContext(
  context: IConnectionContext
): IConnectionStatus {
  // tslint:disable-next-line:no-string-literal
  return useContext(context["$__privateReactInternalContext"]);
}
