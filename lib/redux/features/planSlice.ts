import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Plan {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  locationId: string;
  features: string[];
  createdOn: string;
  updatedOn: string;
}

export interface PlanState {
  data: Plan[];
  loading: boolean;
  error: string | null;
  selectedPlan: Plan | null;
}

const initialState: PlanState = {
  data: [],
  loading: false,
  error: null,
  selectedPlan: null,
};

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlans: (state, action) => {
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
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
});

export const { setPlans, setLoading, setError, setSelectedPlan, clearSelectedPlan } = planSlice.actions;

export const fetchPlans = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/plans");
    if (response.status === 200) {
      dispatch(setPlans(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchPlanById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/plans/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedPlan(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addPlan = (plan: Plan) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/plans", plan);
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

export const updatePlan = (plan: Plan, id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/plans/${id}`, plan);
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

export const deletePlan = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/plans/${id}`);
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


export const selectPlans = (state: RootState) => state.plan.data;
export const selectLoading = (state: RootState) => state.plan.loading;
export const selectError = (state: RootState) => state.plan.error;

export default planSlice.reducer;
