import { OFFLINE_STATUS_CHANGED } from "@redux-offline/redux-offline/lib/constants";
import { checkNetWorkStatus } from "../../functions";
import { CheckNetworkActionTypes } from "./../action-types";

export const networkMiddleware = (api) => (next) => async (action) => {
  const response = next(action);

  const isOnline = api.getState().offline.online;

  if (response.payload === "Network Error" && isOnline) {
    toast.warn("App is OFFLINE; your action will be scheduled.");

    api.dispatch({
      type: OFFLINE_STATUS_CHANGED,
      payload: { online: false },
    });

    api.dispatch({
      type: CheckNetworkActionTypes.FETCH_CHECK_NETWORK_CONNECTION,
    });
  } else if (!isOnline) {
    const isOnlineAgain = await checkNetWorkStatus();

    console.log(isOnlineAgain);

    if (isOnlineAgain) {
      api.dispatch({
        type: OFFLINE_STATUS_CHANGED,
        payload: { online: isOnlineAgain },
      });
    }
  }

  // Otherwise, pass the action down the middleware chain as usual
  return response;
};
