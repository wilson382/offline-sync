import { createSlice } from "@reduxjs/toolkit";
import { createTodo } from "./todos";

const initialState = {
  history: [], //Isso mantém um registro de todas as ações despachadas
  queues: [], //Isso mantém todas as solicitações pendentes não atendidas. Essas solicitações são exibidas na página /sincronização
  totalQueues: 0, //Todos os dados off-line pendentes para serem salvos
};

export const queuesSlice = createSlice({
  name: "queues",
  initialState,
  reducers: {
    removePendingQueue: (state, { meta }) => {
      state.queues = state.queues.filter((q) => q.syncronization_id !== meta.syncronization_id);
      state.totalQueues = state.queues.length;
    },
  },
  extraReducers(builder) {
    builder.addCase(createTodo.type, (state, { payload }) => {
      state.history.push({
        syncronization_id: payload.syncProps.syncronization_id,
        type: payload.syncProps.syncType,
      });

      state.queues.push({
        triesCount: 0,
        error: null,

        //Dados pendentes fáceis de usar
        syncronization_id: payload.syncProps.syncronization_id,
        queueTime: payload.syncProps.queueTime,
        endPoint: payload.syncProps.endPoint,
        syncType: payload.syncProps.syncType,
        syncAmount: payload.syncProps.syncAmount,
        syncTitle: payload.syncProps.syncTitle,
        syncName: payload.syncProps.syncName,
      });
      state.totalQueues = state.queues.length;
    });
  },
});

export const selectTotalQueues = (state) => state.queues.totalQueues;
export const selectQueues = (state) => state.queues.queues;
export const selectHistory = (state) => state.queues.history;

export const { removePendingQueue, addOfflineQueue } = queuesSlice.actions;
export default queuesSlice.reducer;
