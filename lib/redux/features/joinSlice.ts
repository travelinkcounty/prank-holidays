import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface Join {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  from: string;
  status?: string;
  createdOn?: string;
  updatedOn?: string;
}

interface JoinState {
    data: Join[];
    loading: boolean;
    error: string | null;
    selectedJoin: Join | null;
}

const initialState: JoinState = {
  data: [],
  loading: false,
  error: null,
  selectedJoin: null,
};  

const joinSlice = createSlice({
  name: "join",
  initialState,
  reducers: {
    setJoins: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },  
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedJoin: (state, action) => {
      state.selectedJoin = action.payload;
    },
    clearSelectedJoin: (state) => {
      state.selectedJoin = null;
    },
  },
}); 

export const { setJoins, setLoading, setError, setSelectedJoin, clearSelectedJoin } = joinSlice.actions;

export const fetchJoins = () => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get("/api/routes/join-us");
    if (response.status === 200) {
      dispatch(setJoins(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchJoinById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/join-us/${id}`);
    const data: Join = response.data;
    if (response.status === 200) {
      dispatch(setSelectedJoin(data));    
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addJoin = (join: Join) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/join-us", join);
    if (response.status === 201) {
      return response.data;
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const updateJoin = (id: string, join: Join) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/join-us/${id}`, join);
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

export const deleteJoin = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/join-us/${id}`);
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

export const selectJoins = (state: RootState) => state.join.data;
export const selectJoinById = (state: RootState, id: string) => state.join.data.find((join: Join) => join.id === id);
export const selectLoading = (state: RootState) => state.join.loading;
export const selectError = (state: RootState) => state.join.error;

export default joinSlice.reducer;