import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AiStoreState } from '../types/store';

const useAiStore = create(
  immer<AiStoreState>((set) => ({
    prompt: '',
    messages: [],
    loading: false,

    setPrompt: (text: string) =>
      set((state) => {
        state.prompt = text;
      }),

    addMessage: (message) =>
      set((state) => {
        state.messages.push(message);
      }),

    setLoading: (loading: boolean) =>
      set((state) => {
        state.loading = loading;
      }),

    clearMessages: () =>
      set((state) => {
        state.messages = [];
      }),
  }))
);

export default useAiStore;