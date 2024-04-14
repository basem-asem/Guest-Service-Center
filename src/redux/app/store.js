import { configureStore } from "@reduxjs/toolkit";
import TranslationReducer from "../features/TranslationSlice";

export const store = configureStore({
  reducer: {
    Translation: TranslationReducer,
  },
});
