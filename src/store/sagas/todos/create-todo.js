import { put, select } from "redux-saga/effects";
import { toast } from "react-toastify";
import { TodoApi } from "./../../../services";

export function* createTodo({ payload }) {
  try {
    const getOfflineState = (state) => state.offline;
    const { online } = yield select(getOfflineState);

    if (online) {
      yield TodoApi.createTodo(payload);

      yield put(CommissioningActions.fetchSaveAirBalanceSuccess(updatedSystem));
    } else {
      toast.warn("App is OFFLINE; your action will be scheduled.");

      yield put(
        CommissioningActions.fetchSaveAirBalanceOffline(
          selectedSystem,
          editedAirBalances
        )
      );
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.code === "ERR_NETWORK") {
        toast.warn("App is OFFLINE; your action will be scheduled.");
        yield put(
          CommissioningActions.fetchSaveAirBalanceOffline(
            selectedSystem,
            editedAirBalances
          )
        );
      }

      yield put(CommissioningActions.fetchSaveAirBalanceError(e.message));
    }
  }
}
