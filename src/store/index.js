import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { localStorageReduxPersist } from "@/config";
import { offline } from "@redux-offline/redux-offline";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas";
import { networkMiddleware } from "./middleware";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";
import { todoReducer } from "./sagas/todos/reducer";

const persistVersion = 9;
const persistConfig = {
  key: localStorageReduxPersist,
  stateReconciler: autoMergeLevel2,
  version: persistVersion,
  storage,
  blacklist: ["tempState"],
};

const effect = async (effect, _action) => {
  store.dispatch(effect.action);
};

const customConfig = {
  ...offlineConfig,
  rehydrate: true,
  effect: effect,
};

const offlineEnhanceStore = offline(customConfig);

const reducers = combineReducers({
  // todos, //tarefa
  todos: todoReducer,
});

const sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      createStateSyncMiddleware({ blacklist: [PERSIST, PURGE] }),
      sagaMiddleware,
      networkMiddleware
    ),
  enhancers: (defaultEnhancers) =>
    defaultEnhancers.prepend(offlineEnhanceStore),
});

sagaMiddleware.run(rootSaga);

export const persistedStore = persistStore(store);
export default store;
