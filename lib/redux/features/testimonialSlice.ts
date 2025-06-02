import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface Testimonial {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  createdOn: string;
  updatedOn: string;
}

interface TestimonialState {
  data: Testimonial[];
  loading: boolean;
  error: string | null;
  selectedTestimonial: Testimonial | null;
}

const initialState: TestimonialState = {
  data: [],
  loading: false,
  error: null,
  selectedTestimonial: null,
};

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    setTestimonials: (state, action) => {
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
    setSelectedTestimonial: (state, action) => {
      state.selectedTestimonial = action.payload;
    },
    clearSelectedTestimonial: (state) => {
      state.selectedTestimonial = null;
    },
  },
});

export const { setTestimonials, setLoading, setError, setSelectedTestimonial, clearSelectedTestimonial } = testimonialSlice.actions;

  export const fetchTestimonials = () => async (dispatch: Dispatch) => {
    dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/testimonials");
    if (response.status === 200) {
      dispatch(setTestimonials(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {    
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};

export const fetchTestimonialById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/testimonials/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedTestimonial(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error); 
    dispatch(setError(message || "Unknown error"));
  }
};

export const addTestimonial = (testimonial: Testimonial) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post("/api/routes/testimonials", testimonial);
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

export const updateTestimonial = (testimonial: Testimonial, id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.put(`/api/routes/testimonials/${id}`, testimonial);
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

export const deleteTestimonial = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.delete(`/api/routes/testimonials/${id}`); 
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

export const selectTestimonials = (state: RootState) => state.testimonial.data; 
export const selectTestimonialById = (state: RootState, id: string) => state.testimonial.data.find((testimonial: Testimonial) => testimonial.id === id);
export const selectLoading = (state: RootState) => state.testimonial.loading;
export const selectError = (state: RootState) => state.testimonial.error;   

export default testimonialSlice.reducer;