import { OFFLINE_STATUS_CHANGED } from "@redux-offline/redux-offline/lib/constants";
import { checkNetWorkStatus } from "../../functions";
import { CheckNetworkActionTypes } from "../action-types";
import { call, delay, put } from "redux-saga/effects";

export function* fetchListenNetworkConnection({}) {
  try {
    const result = yield call(checkNetWorkStatus);

    if (!result) {
      yield delay(50000);

      yield put({
        type: CheckNetworkActionTypes.FETCH_CHECK_NETWORK_CONNECTION,
      });
    }

    yield put({
      type: OFFLINE_STATUS_CHANGED,
      payload: { online: result },
    });
  } catch (e) {}
}
