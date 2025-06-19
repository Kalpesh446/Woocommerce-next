
import axiosInstance1 from "@/lib/axios";
import axios from "axios";


let CART_TOKEN = null;
let CART_HASH = null;
const isBrowser = () => typeof window !== "undefined";

const getFromStorage = (key) => {
    if (isBrowser()) {
        return localStorage.getItem(key);
    }
    return null;
};

const setToStorage = (key, value) => {
    if (isBrowser()) {
        localStorage.setItem(key, value);
    }
};

if (isBrowser()) {
    CART_TOKEN = getFromStorage("cartToken") || null;
    CART_HASH = getFromStorage("cartHash") || null;
}

export const fetchCart = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
                        ...(CART_HASH && { "cart-hash": CART_HASH }),
                    },
                }
            );

            if (!response.ok) {
                const text = await response.text();
                return reject({ message: "Cart fetch failed", error: text });
            }

            const cartData = await response.json();
            const nonce = response.headers.get("nonce");
            const newToken = response.headers.get("cart-token");
            const newHash = response.headers.get("cart-hash");

            if (nonce) localStorage.setItem("nonce", nonce);
            if (newToken) {
                CART_TOKEN = newToken;
                localStorage.setItem("cartToken", newToken);
            }
            if (newHash) {
                CART_HASH = newHash;
                localStorage.setItem("cartHash", newHash);
            }

            return resolve({
                ...cartData,
                nonce,
                cartToken: CART_TOKEN,
                cartHash: CART_HASH,
            });
        } catch (error) {
            return reject({ message: "Fetch cart error", error });
        }
    });
};

export const addCart = (productId, quantity = 1) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!productId) return reject({ message: "Missing productId" });

            const cartData = await fetchCart();
            const nonce = cartData.nonce || localStorage.getItem("nonce");

            if (!nonce) {
                return reject({ message: "Nonce is missing" });
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/add-item`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        nonce,
                        ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
                    },
                    body: JSON.stringify({
                        id: productId,
                        quantity,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                return reject({
                    message: `Add to cart failed. Status: ${response.status}`,
                    error: errorText,
                });
            }

            const result = await response.json();
            if (result.session_key) {
                localStorage.setItem("cart_session_key", result.session_key);
            }

            const updatedCart = await fetchCart();
            return resolve(updatedCart);
        } catch (error) {
            return reject({ message: "Add to cart error", error });
        }
    });
};

export const removeCartItem = (cartKey, setCart = null, setRemovingProduct = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (setRemovingProduct) setRemovingProduct(true);

            // Initialize cart if needed
            if (!CART_TOKEN) {
                await fetchCart();
            }

            const cartData = await fetchCart();
            const nonce = cartData.nonce || localStorage.getItem("nonce");

            if (!nonce) {
                throw new Error("Nonce is missing. Cannot proceed with remove cart item.");
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/remove-item?key=${cartKey}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        nonce: nonce,
                        ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Failed to remove item from cart. Status: ${response.status}`);
            }

            await response.json();

            const updatedCart = await fetchCart();
            if (setCart) setCart(updatedCart);
            if (setRemovingProduct) setRemovingProduct(false);

            resolve(updatedCart);
        } catch (error) {
            console.error("Remove cart error:", error);
            if (setRemovingProduct) setRemovingProduct(false);
            reject(error);
        }
    });
};

export const updateItemCart = (cartKey, quantity) => {
    return new Promise((resolve, reject) => {
        const nonce = localStorage.getItem("nonce");

        if (!nonce) {
            return reject({ message: "Missing nonce in localStorage" });
        }

        fetch(`${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/update-item`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                nonce: nonce,
                ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
            },
            body: JSON.stringify({ key: cartKey, quantity: quantity }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    return reject({ message: "Cart update failed", error: errorText });
                }

                // ✅ After successful update, fetch the latest cart
                try {
                    const updatedCart = await fetchCart();
                    return resolve(updatedCart);
                } catch (fetchError) {
                    return reject({ message: "Cart updated but failed to fetch updated cart", error: fetchError });
                }
            })
            .catch((err) => reject({ message: "Network error", error: err }));
    });
};

// export const applyCoupon = async (couponCode, setCart, setApplying, setCouponError) => {
//     try {
//         setApplying?.(true);

//         // Ensure CART_TOKEN exists
//         if (!CART_TOKEN) {
//             await fetchCart();
//         }

//         const cartData = await fetchCart();
//         const nonce = cartData.nonce || localStorage.getItem("nonce");

//         if (!nonce) {
//             throw new Error("Nonce is missing. Cannot apply coupon.");
//         }

//         const res = await fetch(`${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/apply-coupon`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//                 nonce,
//                 ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
//             },
//             body: JSON.stringify({ code: couponCode }),
//         });

//         const result = await res.json();
//         console.log(result, 'result');


//         // Handle coupon error if any
//         if (result?.data?.status !== "200") {
//             setCouponError?.(result?.message || "Failed to apply coupon");
//         }

//         const updatedCart = await fetchCart();
//         setCart?.(updatedCart);
//         return updatedCart;
//     } catch (err) {
//         console.error("Apply coupon error:", err);
//         throw err;
//     } finally {
//         setApplying?.(false);
//     }
// };

// cart-service.js
export const applyCoupon = async (couponCode) => {
    if (!couponCode) {
        throw new Error("Coupon code is required");
    }

    const cartData = await fetchCart();
    const nonce = cartData.nonce || localStorage.getItem("nonce");

    if (!nonce) {
        throw new Error("Nonce is missing. Cannot apply coupon.");
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/apply-coupon`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                nonce,
                ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
            },
            body: JSON.stringify({ code: couponCode }),
        }
    );

    const result = await res.json();

    if (result?.code && result?.data?.status >= 400) {
        throw new Error(result?.message || "Failed to apply coupon");
    }

    const updatedCart = await fetchCart();
    return updatedCart;
};



export const removeCoupon = async (couponCode, setCart, setRemovingCoupon) => {
    try {
        setRemovingCoupon?.(true);

        if (!CART_TOKEN) {
            await fetchCart();
        }

        const cartData = await fetchCart();
        const nonce = cartData?.nonce || localStorage.getItem("nonce");

        if (!nonce) throw new Error("Nonce missing. Cannot remove coupon.");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL}/wp-json/wc/store/cart/remove-coupon?code=${couponCode}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    nonce,
                    ...(CART_TOKEN && { "cart-token": CART_TOKEN }),
                },
            }
        );

        if (!res.ok) throw new Error(`Failed to remove coupon: ${res.status}`);

        const updatedCart = await fetchCart();
        setCart?.(updatedCart);
        return updatedCart;
    } catch (error) {
        console.error("Remove coupon error:", error);
        throw error;
    } finally {
        setRemovingCoupon?.(false);
    }
};




const cartService = {
    addCart,
    fetchCart,
    removeCartItem,
    updateItemCart,
    applyCoupon,
    removeCoupon
}

export default cartService   