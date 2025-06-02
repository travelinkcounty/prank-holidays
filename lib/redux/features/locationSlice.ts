import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Location {
  id: string;
  name: string;
  image: string;
  description: string;
  type: string;
  createdOn: string;
  updatedOn: string;
}

export interface LocationState {
  data: Location[];
  loading: boolean;
  error: string | null;
  selectedLocation: Location | null;
}

const initialState: LocationState = {
  data: [],
  loading: false,
  error: null,
  selectedLocation: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
  },
});

export const { setLocations, setLoading, setError, setSelectedLocation, clearSelectedLocation } = locationSlice.actions;

export const fetchLocations = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/locations");
    if (response.status === 200) {
      dispatch(setLocations(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const fetchLocationById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/locations/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedLocation(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {    
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const addLocation = (location: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/locations", location,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
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

export const updateLocation = (location: FormData, id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/locations/${id}`, location,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
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

export const deleteLocation = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/locations/${id}`);
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

export const selectLocations = (state: RootState) => state.location.data;
export const selectLocationById = (state: RootState, id: string) => state.location.data.find((location: Location) => location.id === id);
export const selectLoading = (state: RootState) => state.location.loading;
export const selectError = (state: RootState) => state.location.error;

export default locationSlice.reducer;