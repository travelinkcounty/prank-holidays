import { createSlice, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface Hotel {
  id: string;
  uid: string;
  name: string;
  image: string;
  description: string;
  location: string;
  address: string;
  featured: boolean;
  createdOn: string;
  updatedOn: string;
}

export interface HotelState {
  data: Hotel[];
  loading: boolean;
  error: string | null;
  selectedHotel: Hotel | null;
}

const initialState: HotelState = {
  data: [],
  loading: false,
  error: null,
  selectedHotel: null,
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setHotels: (state, action) => {
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
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload;
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
    },
  },
});

export const { setHotels, setLoading, setError, setSelectedHotel, clearSelectedHotel } = hotelSlice.actions;

export const fetchHotels = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/hotels");
    if (response.status === 200) {
      dispatch(setHotels(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const fetchFeaturedHotels = () => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get("/api/routes/hotels?featured=true");
    if (response.status === 200) {
      dispatch(setHotels(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};    

  export const fetchHotelById = (id: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`/api/routes/hotels/${id}`);
    if (response.status === 200) {
      dispatch(setSelectedHotel(response.data.data));
    } else {
      dispatch(setError(response.data.message));
    }
  } catch (error: unknown) {    
    const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
    dispatch(setError(message || "Unknown error"));
  }
};  

export const addHotel = (hotel: FormData) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.post("/api/routes/hotels", hotel,
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

export const updateHotel = (hotel: FormData, id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.put(`/api/routes/hotels/${id}`, hotel,
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

export const deleteHotel = (id: string) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.delete(`/api/routes/hotels/${id}`);
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

export const selectHotels = (state: RootState) => state.hotel.data;
export const selectHotelById = (state: RootState, id: string) => state.hotel.data.find((hotel: Hotel) => hotel.id === id);
export const selectLoading = (state: RootState) => state.hotel.loading;
export const selectError = (state: RootState) => state.hotel.error;

export default hotelSlice.reducer;