import { put, select } from "redux-saga/effects";
import { TodoApi } from "./../../../services";
import { TodosActionTypes } from "../../action-types";

export function* createTodo({
  payload: { postData, onSuccess, onError, onInfo },
}) {
  try {
    const getOfflineState = (state) => state.offline;
    const { online } = yield select(getOfflineState);

    if (online) {
      const { data } = yield TodoApi.createTodo({
        ...postData,
        completed: "1",
      });

      yield put({
        type: TodosActionTypes.CREATE_TODO_SUCCESS,
        payload: {
          ...data,
          completed: "1",
        },
      });
      onSuccess?.("nova tarefa criada!", { position: "bottom center" });
    } else {
      onInfo?.("App is OFFLINE; your action will be scheduled.");
      yield put({
        type: TodosActionTypes.CREATE_TODO_OFFLINE,
        payload: {
          ...postData,
          completed: "0",
        },
        meta: {
          offline: {
            effect: {
              action: {
                type: TodosActionTypes.CREATE_TODO_STARTED,
                payload: { postData },
              },
            },
          },
        },
      });
    }
  } catch (e) {
    console.log(e);
    if (e?.name === "Network Error") {
      onError?.("App is OFFLINE; your action will be scheduled.");
      yield put({
        type: TodosActionTypes.CREATE_TODO_OFFLINE,
        payload: {
          ...postData,
          completed: "0",
        },
        meta: {
          offline: {
            effect: {
              action: {
                type: TodosActionTypes.CREATE_TODO_STARTED,
                payload: { postData },
              },
            },
          },
        },
      });
    } else {
      onError?.(e?.message);
      yield put({
        type: TodosActionTypes.CREATE_TODO_ERROR,
        payload: e?.message,
      });
    }
  }
}
