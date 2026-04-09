import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resolveApiMessage, tMessage } from "../../utils/translateApiMessage";


// Add items to cart
export const addItemsToCart = createAsyncThunk(
  "cart/AddItemsToCart",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      if (!user?.isAuthenticated) {
        return rejectWithValue({ message: tMessage("api.cart.signInRequired") });
      }
      
      const {data} = await axios.get(`/api/v1/product/${id}`);
      return{

        product:data.product._id,
        name:data.product.name,
        price:data.product.price,
        image:data.product.image[0].url,
        stock:data.product.stock,
        quantity
        
      } ;


    } catch (error) {
      return rejectWithValue({ message: resolveApiMessage(error, "api.cart.addFailed") });
    }
  }
);


const cartSlice = createSlice({

  name: "cart",
  initialState: {

    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removingId: null,
    shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {}

  },
  reducers:{

    removeErrors: (state) => {

      state.error = null

    },
    removeMessage: (state) => {

      state.message = null

    },
    removeItemFromCart: (state, action) => {

      state.removingId = action.payload;
      state.cartItems = state.cartItems.filter( item => item.product!=action.payload );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      state.removingId = null

    },
    saveShippingInfo:(state, action) => {

      state.shippingInfo = action.payload
      localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))

    },
    clearCart: (state) => {
      state.cartItems = [];
      state.success = false;
      state.message = null;
      state.error = null;
      localStorage.removeItem("cartItems");
    }

  },
  extraReducers: (builder) => {

    //Add items to cart
    builder.addCase(addItemsToCart.pending, (state) => {

      state.loading = true
      state.error = null

    })

  builder.addCase(addItemsToCart.fulfilled, (state, action) => {
    const item = action.payload;
    const existingItem = state.cartItems.find(i => i.product === item.product);

    if (existingItem) {
      existingItem.quantity = item.quantity;
      state.message = tMessage("api.cart.updatedQuantity", { name: item.name });
    } else {
      state.cartItems.push(item);
      state.message = tMessage("api.cart.itemAdded", { name: item.name });
    }

    state.loading = false;
    state.error = null;
    state.success = true;
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
  });

    builder.addCase(addItemsToCart.rejected, (state, action) => {

      state.loading = false;
      state.error = action.payload?.message || tMessage("common.somethingWrong");

    })

  }

})



export const { removeErrors, removeMessage, removeItemFromCart, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
