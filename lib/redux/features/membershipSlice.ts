import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  totalDays: number;
  totalNights: number;
  usedDays: number;
  usedNights: number;
  createdOn: string;
  updatedOn: string;
  status: string;
}

export interface MembershipState {
  data: Membership[];
  loading: boolean;
  error: string | null;
  selectedMembership: Membership | null;
}

const initialState: MembershipState = {
  data: [],
  loading: false,
  error: null,
  selectedMembership: null,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    setMemberships: (state, action) => {
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
    setSelectedMembership: (state, action) => {
      state.selectedMembership = action.payload;
      state.error = null;
    },
    clearSelectedMembership: (state) => {
      state.selectedMembership = null;
      state.error = null;
    },
  },
});

export const { setMemberships, setLoading, setError, setSelectedMembership, clearSelectedMembership } = membershipSlice.actions;

export const fetchMemberships = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/memberships");
    if (response.status === 200) {
      dispatch(setMemberships(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchMembershipByUserId = (userId: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/memberships?userId=${userId}`);
    if (response.status === 200) {  
      dispatch(setMemberships(response.data.data)); 
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchMembershipById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/memberships/${id}`);
    if (response.status === 200) {
        dispatch(setSelectedMembership(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addMembership = (membershipData: any) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post("/api/routes/memberships", membershipData);
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

export const updateMembership = (membershipData: any, id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.put(`/api/routes/memberships/${id}`, membershipData);
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

export const deleteMembership = (id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.delete(`/api/routes/memberships/${id}`);
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

export const selectMemberships = (state: RootState) => state.membership.data;
export const selectMembershipById = (state: RootState, id: string) => state.membership.data.find((mem: Membership) => mem.id === id);
export const selectLoading = (state: RootState) => state.membership.loading;
export const selectError = (state: RootState) => state.membership.error;

export default membershipSlice.reducer;    