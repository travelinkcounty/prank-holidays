import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// Define a type for gallery items
export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  createdOn: string;
  updatedOn: string;
}

interface GalleryState {
  gallery: GalleryItem[];
  isLoading: boolean;
  error: string | null;
  selectedGallery: GalleryItem | null;
}

const initialState: GalleryState = {
  gallery: [],
  isLoading: false,
  error: null,
  selectedGallery: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGallery: (state, action) => {
      state.gallery = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSelectedGallery: (state, action) => {
      state.selectedGallery = action.payload;
    },
    clearSelectedGallery: (state) => {
      state.selectedGallery = null;
    },
    clearGallery: (state) => {
      state.gallery = [];
    },
  },
});

export const { setGallery, setIsLoading, setError, setSelectedGallery, clearSelectedGallery, clearGallery } = gallerySlice.actions;

export const fetchGallery = () => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get("/api/routes/gallery");
    if (response.status === 200) {
      dispatch(setGallery(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchGalleryById = (id: string) => async (dispatch: Dispatch) => {     
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get(`/api/routes/gallery/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedGallery(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addGallery = (gallery: FormData) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.post("/api/routes/gallery", gallery,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      dispatch(setGallery(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const updateGallery = (gallery: FormData, id: string) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.put(`/api/routes/gallery/${id}`, gallery,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status === 200) {
      dispatch(setGallery(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const deleteGallery = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.delete(`/api/routes/gallery/${id}`);
    if (response.status === 200) {
      dispatch(setGallery(response.data.data));
    } else {
      dispatch(setError(response.data.message)); 
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
}; 

export const selectGallery = (state: RootState) => state.gallery.gallery;
export const selectSelectedGallery = (state: RootState) => state.gallery.selectedGallery;
export const selectIsLoading = (state: RootState) => state.gallery.isLoading;
export const selectError = (state: RootState) => state.gallery.error;

export default gallerySlice.reducer;