import { TodosActionTypes } from "../../action-types/todos";
import { thunkTodosDelete, thunkTodosFetch } from "../../slices/todos";
import { RESET_STATE } from "@redux-offline/redux-offline/lib/constants";

const initialState = {
  todos: [],
  status: "idle",
  error: null,
  lastFetch: null,
};

export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case TodosActionTypes.CREATE_TODO_STARTED:
      return {
        ...state,
      };
    case RESET_STATE:
      return {
        ...state,
        todos: state.todos.filter((x) => x.completed != "0"),
      };
    case thunkTodosDelete.fulfilled.type:
      return initialState;
    case thunkTodosFetch.pending.type:
      return {
        ...state,
        status: "loading",
      };
    case thunkTodosFetch.fulfilled.type:
      return {
        ...state,
        lastFetch: Date.now(),
        status: "succceed",
        todos: action.payload,
      };
    case thunkTodosFetch.rejected.type:
      return {
        ...state,
        status: failed,
        error: action.error.message,
      };
    case TodosActionTypes.CREATE_TODO_SUCCESS:
      return {
        ...state,
        todos: [
          ...state.todos.filter((x) => x.id !== action.payload.id),
          action.payload,
        ],
      };
    case TodosActionTypes.CREATE_TODO_OFFLINE:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case TodosActionTypes.CREATE_TODO_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
