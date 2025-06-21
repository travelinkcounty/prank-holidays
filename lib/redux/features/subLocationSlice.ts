import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface SubLocation {
  id: string;
  uid: string;
  name: string;
  image: string;
  description: string;
  type: string;
  address: string;
  locationId: string;
  createdOn: string;
  updatedOn: string;
}

export interface SubLocationState {
   data: SubLocation[];
  loading: boolean;
  error: string | null;
  selectedSubLocation: SubLocation | null;
}

const initialState: SubLocationState = {
  data: [],
  loading: false,
  error: null,
  selectedSubLocation: null,
};

const subLocationSlice = createSlice({
  name: "subLocation",
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
    setSelectedSubLocation: (state, action) => {
      state.selectedSubLocation = action.payload;
    },
    clearSelectedSubLocation: (state) => {
      state.selectedSubLocation = null;
    },
  },
});

export const { setLocations, setLoading, setError, setSelectedSubLocation, clearSelectedSubLocation } = subLocationSlice.actions;

export const fetchSubLocations = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/sub-locations");
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

export const fetchFeaturedSubLocations = (locationId: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/sub-locations?locationId=${locationId}`);
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

export const fetchSubLocationById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/sub-locations/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedSubLocation(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {    
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const addSubLocation = (location: FormData) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post("/api/routes/sub-locations", location,
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

export const updateSubLocation = (location: FormData, id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.put(`/api/routes/sub-locations/${id}`, location,
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

export const deleteSubLocation = (id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.delete(`/api/routes/sub-locations/${id}`);
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

export const selectSubLocations = (state: RootState) => state.subLocation.data;
export const selectSubLocationById = (state: RootState, id: string) => state.subLocation.data.find((subLocation: SubLocation) => subLocation.id === id);
export const selectSubLoading = (state: RootState) => state.subLocation.loading;
export const selectSubError = (state: RootState) => state.subLocation.error;

export default subLocationSlice.reducer;