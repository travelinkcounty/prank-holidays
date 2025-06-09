import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface History {
  id: string;
  uid: string;
  userId: string;
  package_ref: string;
  createdOn: string;
  updatedOn: string;
  status: string;
}

export interface HistoryState {
  data: History[];
  loading: boolean;
  error: string | null;
  selectedHistory: History | null;
}

const initialState: HistoryState = {
  data: [],
  loading: false,
  error: null,
  selectedHistory: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistories: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedHistory: (state, action) => {
      state.selectedHistory = action.payload;
      state.error = null;
    },
    clearSelectedHistory: (state) => {
      state.selectedHistory = null;
      state.error = null;
    },
  },
});

export const { setHistories, setLoading, setError, setSelectedHistory, clearSelectedHistory } = historySlice.actions;

export const fetchHistories = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/history");
    if (response.status === 200) {
      dispatch(setHistories(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchPackageById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/history/${id}`);
    if (response.status === 200) {
        dispatch(setSelectedHistory(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchHistoryByUserId = (userId: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/history/?userId=${userId}`);
    if (response.status === 200) {
      dispatch(setHistories(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const addHistory = (historyData: any) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post("/api/routes/history", historyData);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const updateHistory = (historyData: any, id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.put(`/api/routes/history/${id}`, historyData);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const deleteHistory = (id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.delete(`/api/routes/history/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const selectHistories = (state: RootState) => state.history.data;
export const selectHistoryById = (state: RootState, id: string) => state.history.data.find((hist: History) => hist.id === id);
export const selectLoading = (state: RootState) => state.history.loading;
export const selectError = (state: RootState) => state.history.error;

export default historySlice.reducer;    