import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  days: string;
  locationId: string;
  createdOn: string;
  updatedOn: string;
}

export interface PackageState {
  data: Package[];
  loading: boolean;
  error: string | null;
  selectedPackage: Package | null;
}

const initialState: PackageState = {
  data: [],
  loading: false,
  error: null,
  selectedPackage: null,
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setPackages: (state, action) => {
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
    setSelectedPackage: (state, action) => {
      state.selectedPackage = action.payload;
    },
    clearSelectedPackage: (state) => {
      state.selectedPackage = null;
    },
  },
});

export const { setPackages, setLoading, setError, setSelectedPackage, clearSelectedPackage } = packageSlice.actions;

export const fetchPackages = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/packages");
    if (response.status === 200) {
      dispatch(setPackages(response.data.data));
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
    const response = await axios.get(`/api/routes/packages/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedPackage(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addPackage = (packageData: FormData) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/packages", packageData,
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

export const updatePackage = (packageData: FormData, id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/packages/${id}`, packageData,
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

export const deletePackage = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/packages/${id}`);
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

export const selectPackages = (state: RootState) => state.package.data;
export const selectPackageById = (state: RootState, id: string) => state.package.data.find((pkg: Package) => pkg.id === id);
export const selectLoading = (state: RootState) => state.package.loading;
export const selectError = (state: RootState) => state.package.error;

export default packageSlice.reducer;    