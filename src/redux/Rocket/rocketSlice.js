import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const ROCKETS = "rocket/FetchRokets";
const BOOK_ROCKETS = "spaceTraveller/bookRocket";

export const fetchRockets = createAsyncThunk(ROCKETS, async () =>
  fetch("https://api.spacexdata.com/v3/rockets")
    .then((response) => response.json())
    .then((data) => {
      const rockets = data.map((rocket) => ({
        id: rocket.id,
        rocket_name: rocket.rocket_name,
        description: rocket.description,
        flickr_images: rocket.flickr_images[0],
      }));

      return rockets;
    })
    .catch((error) => {
      throw new Error(error);
    })
);

const rocketSlice = createSlice({
  name: "rockets",
  initialState: {
    rockets: [],
    loading: false,
    refresh: true,
  },
  reducers: {
    bookRocket: (state, action) => {
      const Newrockets = state.rockets.map((rocket) => {
        if (rocket.id !== action.payload) return rocket;
        return { ...rocket, reserved: true };
      });
      return { ...state, Newrockets };
    },
  },

  extraReducers: {
    [fetchRockets.pending]: (state) => ({ ...state, isloading: true }),
    [fetchRockets.fulfilled]: (state, action) => ({
      ...state,
      rockets: action.payload,
      isloading: false,
    }),
    [fetchRockets.rejected]: (state) => ({ ...state, isloading: false }),
  },
});
export const bookRocket = (id) => ({
  type: BOOK_ROCKETS,
  payload: id,
});
export default rocketSlice.reducer;
