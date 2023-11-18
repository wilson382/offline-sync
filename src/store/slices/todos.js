import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { removePendingQueue } from "./queues";
import axios from "axios";

const endPoint = "https://api-prod.wprestamos.com";

export const thunkTodosFetch = createAsyncThunk("todos/fetch", async () => {
  const { data } = await axios.get(`${endPoint}/todos`);
  return data;
});

export const thunkTodosDelete = createAsyncThunk("todos/delete", async () => {
  const { data } = await axios.delete(`${endPoint}/todos`);
  return data;
});

const initialState = {
  todos: [],
  status: "idle",
  error: null,
  lastFetch: null,
};

export const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {
    createTodo: {
      reducer: (state, action) => {
        state.todos.push({ ...action.payload.postData, completed: "0" });
      },
      prepare: ({ postData, syncronization_id, data_id }) => {
        const syncProps = {
          data_id,
          syncronization_id,
          syncType: "createTodo",
          syncTitle: "Nova tarefa",
          syncName: "Nova tarefa criada",
        };

        const meta = {
          offline: {
            effect: { url: `${endPoint}/todos`, method: "POST", json: { ...postData } },
            commit: { type: removePendingQueue.type, meta: { syncronization_id } },
            rollback: { type: removePendingQueue.type, meta: { syncronization_id } },
          },
        };

        return { payload: { postData, syncProps }, meta };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(thunkTodosDelete.fulfilled, (state) => {
        return { ...initialState };
      })
      .addCase(thunkTodosFetch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(thunkTodosFetch.fulfilled, (state, action) => {
        state.status = "succceed";
        state.lastFetch = Date.now();
        state.todos = action.payload;
      })
      .addCase(thunkTodosFetch.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      });
  },
});

export const selectError = (state) => state.todos.error;
export const selectStatus = (state) => state.todos.status;
export const selectTodos = (state) => state.todos.todos;

export const { createTodo, resetTodos } = todos.actions;
export default todos.reducer;
