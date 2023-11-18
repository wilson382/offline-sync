import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import queues from "./slices/queues";
import todos from "./slices/todos";
import { createOffline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults/index";
import { localStorageReduxPersist } from "@/config";

const persistVersion = 8;
const persistConfig = {
  key: localStorageReduxPersist,
  stateReconciler: autoMergeLevel2,
  version: persistVersion,
  storage,
  blacklist: ["tempState"],
};

const {
  middleware: offlineMiddleware,
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore,
} = createOffline({
  ...offlineConfig,
  persist: false,
});

const reducers = combineReducers({
  queues, // file
  todos, //tarefa
});

const persistedReducer = persistReducer(persistConfig, offlineEnhanceReducer(reducers));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(createStateSyncMiddleware({ blacklist: [PERSIST, PURGE] }), offlineMiddleware),
  enhancers: (defaultEnhancers) => defaultEnhancers.prepend(offlineEnhanceStore),
});

initMessageListener(store);
setupListeners(store.dispatch);

export const persistedStore = persistStore(store);
export default store;
