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
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json(
            { error: "Missing product slug" },
            { status: 400 }
        );
    }

    try {
        const response = await api.get("products", {
            slug,
            status: "publish",
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}
