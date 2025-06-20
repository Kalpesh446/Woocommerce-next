import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const WOO_URL = process.env.NEXT_PUBLIC_WOO_COMMERCE_WORDPRESS_SITE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

const cartInstance = axios.create({
  baseURL: WOO_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for cart instance
const isBrowser = () => typeof window !== "undefined";

if (isBrowser()) {
  cartInstance.interceptors.request.use(
    (config) => {
      const cartToken = localStorage.getItem("cartToken");
      const cartHash = localStorage.getItem("cartHash");
      
      if (cartToken) config.headers["cart-token"] = cartToken;
      if (cartHash) config.headers["cart-hash"] = cartHash;
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

// Add response interceptor for cart instance
cartInstance.interceptors.response.use(
  (response) => {
    const nonce = response.headers.get("nonce");
    const newToken = response.headers.get("cart-token");
    const newHash = response.headers.get("cart-hash");

    if (nonce) localStorage.setItem("nonce", nonce);
    if (newToken) localStorage.setItem("cartToken", newToken);
    if (newHash) localStorage.setItem("cartHash", newHash);

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { cartInstance };
