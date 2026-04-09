import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resolveApiMessage, tMessage } from "../../utils/translateApiMessage";

// Creating Order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      };

      const { data } = await axios.post("/api/v1/new/order", order, config);
      return data;
    } catch (error) {
      return rejectWithValue({ message: resolveApiMessage(error, "api.orders.createFailed") });
    }
  }
);

// Get User Orders
export const getAllMyOrders = createAsyncThunk(
  "order/getAllMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      };

      const { data } = await axios.get("/api/v1/orders/user", config);
      return data;
    } catch (error) {
      return rejectWithValue({ message: resolveApiMessage(error, "api.orders.fetchFailed") });
    }
  }
);

//Get Order DEtails
export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async(orderId, {rejectWithValue}) => {

  try{

    const {data} = await axios.get(`/api/v1/order/${orderId}`, { withCredentials: true })
    return data;

  }catch(error){

    return rejectWithValue({ message: resolveApiMessage(error, "api.orders.detailsFailed") })

  }

})

const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {},
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {

    // Creating Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = action.payload.success;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
        action.payload?.message || tMessage("api.orders.createFailed");
      })

    // Get User Orders
    builder
    .addCase(getAllMyOrders.pending, (state) => {

      state.loading = true,
      state.error = null

    })
    .addCase(getAllMyOrders.fulfilled, (state, action) => {

      state.loading = false,
      state.orders = action.payload.orders
      state.success = action.payload.success

    })
    .addCase(getAllMyOrders.rejected, (state, action) => {

      state.loading = false,
      state.error = action.payload?.message || tMessage("api.orders.fetchFailed")

    })

    //Get Order Details
    builder
    .addCase(getOrderDetails.pending, (state) => {

      state.loading = true,
      state.error = null

    })
    .addCase(getOrderDetails.fulfilled, (state,action) => {

      state.loading = false,
      state.order = action.payload.order
      state.success = action.payload.success

    })
    .addCase(getOrderDetails.rejected, (state, action) => {

      state.loading = false,
      state.error = action.payload?.message || tMessage("api.orders.detailsFailed")

    })
  },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
