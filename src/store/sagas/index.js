import { all, fork, takeLatest } from "redux-saga/effects";
import { CheckNetworkActionTypes } from "../action-types";
import { fetchListenNetworkConnection } from "./network";
import { todosSagas } from "./todos";

export function* rootSaga() {
  yield all([
    fork(todosSagas),
    takeLatest(
      CheckNetworkActionTypes.FETCH_CHECK_NETWORK_CONNECTION,
      fetchListenNetworkConnection
    ),
  ]);
}
