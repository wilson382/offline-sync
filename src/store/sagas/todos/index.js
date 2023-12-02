import { all, takeEvery } from "redux-saga/effects";
import { TodosActionTypes } from "../../action-types/todos";
import { createTodo } from "./create-todo";

export function* todosSagas() {
  yield all([takeEvery(TodosActionTypes.CREATE_TODO_STARTED, createTodo)]);
}
