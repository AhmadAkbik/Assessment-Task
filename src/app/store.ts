import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import posterReducer from '../features/posts/posterSlice';


export const store = configureStore({
  reducer: {
    posts: posterReducer,   
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
