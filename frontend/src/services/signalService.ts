import { signalsApi } from '@/lib/signalsApi';

export const signalService = {
  getSignals: async () => {
    try {
      const data = await signalsApi.getAllSignals();
      return { data };
    } catch (error) {
      throw error;
    }
  },

  createSignal: async (data: any) => {
    try {
      return await signalsApi.createSignal(data);
    } catch (error) {
      throw error;
    }
  },

  updateSignal: async (id: string, data: any) => {
    try {
      return await signalsApi.updateSignal(id, data);
    } catch (error) {
      throw error;
    }
  },

  deleteSignal: async (id: string) => {
    try {
      return await signalsApi.deleteSignal(id);
    } catch (error) {
      throw error;
    }
  },
};
