import cartService from '@/Services/cart-service';
import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCartItems = createAsyncThunk('cart/fetchCart', async (payload, { rejectWithValue }) => {
    try {
        const cart = await cartService.fetchCart()
        return cart.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (payload, { rejectWithValue }) => {
        try {
            const cart = await cartService.addCart(payload);
            return cart;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (payload, { rejectWithValue }) => {
        try {
            const updatedCart = await cartService.removeCartItem(payload);
            console.log(updatedCart, 'updatedCart');

            return updatedCart;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateItemInCart = createAsyncThunk(
    "cart/updateItemInCart",
    async ({ cartKey, quantity }, { rejectWithValue }) => {
        try {
            const updatedCart = await cartService.updateItemCart(cartKey, quantity)
            return updatedCart;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// export const applyCoupon = createAsyncThunk(
//     "cart/applyCoupon",
//     async (couponCode, { rejectWithValue }) => {
//         try {
//             const updatedCart = await cartService.applyCoupon(couponCode)
//             console.log(updatedCart, 'updatedCartapplyCoupon');

//             return updatedCart;
//         } catch (error) {
//             return rejectWithValue(error);
//         }
//     }
// );

export const applyCoupon = createAsyncThunk(
    "cart/applyCoupon",
    async (couponCode, { rejectWithValue }) => {
        try {
            const result = await cartService.applyCoupon(couponCode);
            console.log(result, 'updatedCartapplyCoupon');

            return result;
        } catch (error) {
            return rejectWithValue({ message: error.data.message });
        }
    }
);

export const removeCoupon = createAsyncThunk(
    "cart/removeCoupon",
    async (couponCode, { rejectWithValue }) => {
        try {
            const updatedCart = await cartService.removeCoupon(couponCode)
            console.log(updatedCart, 'updatedCartremoveCoupon');
            return updatedCart;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: false,
    quantity: 0,
    cart: null
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setLoading: (state, { payload }) => {
            state.loading = payload
        },
        resetState: () => {
            return { ...initialState }
        }
    },
    extraReducers: (builder) => {
        // fetch carts
        builder
            .addCase(fetchCartItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.loading = false;
            })

        builder
        // add to cart
        builder.addCase(addToCart.pending, state => {
            state.loading = true
        })
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.quantity = action.payload.data.items_count;
        });
        builder.addCase(addToCart.rejected, state => {
            state.loading = false
        })

        // Remove from cart
        builder.addCase(removeFromCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            state.loading = false;
            state.quantity = action.payload.data.items_count;
            });
        builder.addCase(removeFromCart.rejected, (state) => {
            state.loading = false;
        });

        // Update item in cart
        builder.addCase(updateItemInCart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateItemInCart.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(updateItemInCart.rejected, (state) => {
            state.loading = false;
        });

        // Apply coupon
        builder.addCase(applyCoupon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(applyCoupon.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(applyCoupon.rejected, (state) => {
            state.loading = false;
        });

        // Remove coupon
        builder.addCase(removeCoupon.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(removeCoupon.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(removeCoupon.rejected, (state) => {
            state.loading = false;
        });

    },
});


export const cartActions = cartSlice.actions
export default cartSlice.reducer
