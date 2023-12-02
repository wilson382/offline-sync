import { createAsyncThunk } from "@reduxjs/toolkit";
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

export const selectError = (state) => state.todos.error;
export const selectStatus = (state) => state.todos.status;
export const selectTodos = (state) => state.todos.todos;
