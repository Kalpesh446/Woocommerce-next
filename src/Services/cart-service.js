
import { cartInstance } from "@/lib/axios";
import { handleApiErr, handleApiRes } from "./handleApi";

const fetchCart = () => {
    return new Promise((resolve, reject) => {
        cartInstance
            .get('/wp-json/wc/store/cart/')
            .then(res => resolve(handleApiRes(res)))
            .catch(err => reject(handleApiErr(err)));
    });
};

const addCart = (payload) => {
    return new Promise((resolve, reject) => {

        cartInstance
            .post('/wp-json/wc/store/cart/add-item', payload)
            .then(res => resolve(handleApiRes(res)))
            .catch(err => reject(handleApiErr(err)));
    });
};

const removeCartItem = (payload) => {
    return new Promise((resolve, reject) => {
        cartInstance
            .post(`/wp-json/wc/store/cart/remove-item?key=${payload.cartKey}`)
            .then(res => resolve(handleApiRes(res)))
            .catch(err => reject(handleApiErr(err)));
    });
};

const updateItemCart = (payload) => {
    return new Promise((resolve, reject) => {
        cartInstance
            .post('/wp-json/wc/store/cart/update-item', {
                key: payload.cartKey,
                quantity: payload.quantity
            })
            .then(res => {
                const updatedCart = handleApiRes(res);
                resolve(updatedCart);
            })
            .catch(err => reject(handleApiErr(err)));
    });
};

const applyCoupon = (payload) => {
    return new Promise((resolve, reject) => {
        cartInstance
            .post('/wp-json/wc/store/cart/apply-coupon', payload)
            .then(res => resolve(handleApiRes(res)))
            .catch(err => reject(handleApiErr(err)));
    });
};

const removeCoupon = (couponCode, setCart, setRemovingCoupon) => {
    return new Promise((resolve, reject) => {
        if (!couponCode) return reject({ message: "Coupon code is required" });

        cartInstance
            .post(`/wp-json/wc/store/cart/remove-coupon?code=${couponCode}`)
            .then(res => {
                const updatedCart = handleApiRes(res);
                if (setCart) setCart(updatedCart);
                if (setRemovingCoupon) setRemovingCoupon(false);
                resolve(updatedCart);
            })
            .catch(err => {
                if (setRemovingCoupon) setRemovingCoupon(false);
                reject(handleApiErr(err));
            });
    });
};

const cartService = {
    fetchCart,
    addCart,
    removeCartItem,
    updateItemCart,
    applyCoupon,
    removeCoupon
};

export default cartService;   