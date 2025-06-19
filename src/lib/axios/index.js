import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL

export const CART_URL = process.env.WOO_COMMERCE_WORDPRESS_SITE_URL

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

// export const userRequest = axios.create({
//     baseURL: CART_URL
// })


export default axiosInstance;
