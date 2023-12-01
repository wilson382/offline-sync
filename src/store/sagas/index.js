import { all, fork, takeLatest } from "redux-saga/effects";
import { CheckNetworkActionTypes } from "../action-types";
import { fetchListenNetworkConnection } from "./network";

export function* rootSaga() {
  yield all([
    takeLatest(
      CheckNetworkActionTypes.FETCH_CHECK_NETWORK_CONNECTION,
      fetchListenNetworkConnection
    ),
  ]);
}
