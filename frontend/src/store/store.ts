import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import tokenReducer from "./slice/tokenSlice";
import workspaceReducer from "./slice/workspaceSlice";
import projectReducer from "./slice/projectSlice";

import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "token", "workspace", "project"], // without token accesstoken remove from localStorage every refreshing
}

const rootReducer = combineReducers({
    auth: authReducer,
    token: tokenReducer,
    workspace: workspaceReducer,
    project: projectReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer) //before store or return state first check localStorage

export const store = configureStore({ 
    reducer: persistedReducer,
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 