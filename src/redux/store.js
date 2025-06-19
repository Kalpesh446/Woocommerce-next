// redux-persist code 

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import persistStore from 'redux-persist/es/persistStore';
import { persistReducer } from 'redux-persist';

import productReducer from '@/redux/slices/productSlice';
import cartReducer from '@/redux/slices/cartSlice';

const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'], // only persist cart
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // needed for redux-persist
        }),
});


export const persistor = persistStore(store);





// without redux-persist code

// import { configureStore } from '@reduxjs/toolkit';
// import productReducer from './slices/productSlice';
// import cartReducer from './slices/cartSlice';

// export const store = configureStore({
//     reducer: {
//         products: productReducer,
//         cart: cartReducer,
//     },
// });