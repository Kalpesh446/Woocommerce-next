import axiosInstance from '@/lib/axios';
import productService, { getProductBySlug } from '@/Services/products-service';
import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const getAllProducts = createAsyncThunk('product/getAllProducts', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await productService.getAll(payload)
        console.log(data, 'dataproducts');

        return {
            products: Array.isArray(data) ? data : [],
            rowCount: data.length || 0
        }
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const fetchProductBySlug = createAsyncThunk(
    'products/fetchBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const { data } = await getProductBySlug(slug);
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid product response');
            }
            return data[0];
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch product');
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        product: {},
        loading: false,
        error: null,
        rowCount: 0
    },
    reducers: {
        setLoading: (state, { payload }) => {
            state.loading = payload;
        },
        resetState: () => {
            return {
                products: [],
                product: {},
                loading: false,
                error: null,
                rowCount: 0
            };
        },
        resetProduct: (state) => {
            state.product = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllProducts.fulfilled, (state, { payload: { products, rowCount } }) => {
                state.products = products
                state.rowCount = rowCount
                state.loading = false
            })
            .addCase(getAllProducts.rejected, state => {
                state.loading = false
                state.products = []
            })

            // 🔥 Support for fetch by slug
            .addCase(fetchProductBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.product = null;
            });
    },
});


export default productSlice.reducer;
