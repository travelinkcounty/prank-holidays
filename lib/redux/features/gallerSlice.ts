import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// Define a type for gallery items
export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category?: string;
  // Add more fields as needed
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

export const fetchGallery = async (dispatch: Dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get("/api/gallery/getallgalleryimages");
    const data: GalleryItem[] = response.data;
    if (response.status === 200) {
      dispatch(setGallery(data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchGalleryById = async (dispatch: Dispatch, id: string) => {     
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get(`/api/gallery/getgallerybyid/${id}`);
    const data: GalleryItem = response.data;
    if (response.status === 200) {
      dispatch(setSelectedGallery(data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const addGallery = async (dispatch: Dispatch, gallery: GalleryItem) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.post("/api/gallery/addgallery", gallery);
    const data: GalleryItem[] = response.data;
    if (response.status === 200) {
      dispatch(setGallery(data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const updateGallery = async (dispatch: Dispatch, gallery: GalleryItem) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.put(`/api/gallery/updategallery/${gallery.id}`, gallery);
    const data: GalleryItem[] = response.data;
    if (response.status === 200) {
      dispatch(setGallery(data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const deleteGallery = async (dispatch: Dispatch, id: string) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.delete(`/api/gallery/deletegallery/${id}`);
    const data: GalleryItem[] = response.data;
    if (response.status === 200) {
      dispatch(setGallery(data));
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