
const baseURL = process.env.NEXT_PUBLIC_SITE_URL;

export const getProductsData = async (page = 1, perPage = 24) => {
    try {
        const res = await fetch(
            `${baseURL}/api/products?page=${page}&per_page=${perPage}`
        );
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid product response");
        return data;
    } catch (error) {
        console.error("Client fetch error:", error);
        return [];
    }
};

export const getProductBySlug = async (slug = "") => {
    try {
        const res = await fetch(`${baseURL}/api/product-by-slug?slug=${slug}`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid response");
        return data;
    } catch (error) {
        console.error("Client fetch error (by slug):", error);
        return [];
    }
};
