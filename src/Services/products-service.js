import axiosInstance from "@/lib/axios";
import { handleApiErr, handleApiRes } from "./handleApi";

const getAll = payload => {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get('/api/products', { params: payload })
            .then(res => resolve(handleApiRes(res)))
            .catch(err => reject(handleApiErr(err)))
    })
}

export const getProductBySlug = (slug) => {
    return new Promise((resolve, reject) => {
        axiosInstance
            .get(`/api/product-by-slug?slug=${slug}`)
            .then(res => resolve(handleApiRes(res)))
            .catch(err => reject(handleApiErr(err)));
    });
};


const productService = {
    getAll,
    getProductBySlug
}

export default productService   
