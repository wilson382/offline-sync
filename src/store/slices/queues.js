import { createSlice } from "@reduxjs/toolkit";
import { createTodo } from "./todos";

const initialState = {
  /**
   * Isso mantém um registro de todas as ações despachadas, nunca exclua desta coleção.
   * Quando o usuário sai, essa coleção é enviada para o servidor e cada item é consultado
   * no banco de dados, para saber se há alguma perda de dados.
   */
  history: [],
  /**
   * Isso mantém quaisquer solicitações pendentes não atendidas. Essas solicitações são exibidas na página /sync,
   * é como uma cópia da caixa de saída redux-offline, mas mais fácil de usar.
   */
  queues: [],
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
      //Sempre que uma ação for despachada, gostaria de saber se foi feita online ou offline. Não tenho certeza se este é o lugar certo
      const network = "online/offline";
      state.history.push({
        syncronization_id: payload.syncProps.syncronization_id,
        type: payload.syncProps.syncType,
        network,
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
