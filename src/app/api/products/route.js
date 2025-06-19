import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: process.env.WOO_COMMERCE_WORDPRESS_SITE_URL,
    consumerKey: process.env.WOO_COMMERCE_WC_CONSUMER_KEY,
    consumerSecret: process.env.WOO_COMMERCE_WC_CONSUMER_SECRET,
    version: "wc/v3",
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const perPage = searchParams.get("per_page") || 100;

    try {
        const response = await api.get("products", {
            per_page: perPage,
            page,
            status: "publish",
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("API error:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

