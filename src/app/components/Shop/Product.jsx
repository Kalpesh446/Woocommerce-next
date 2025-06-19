"use client";
import { addToCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Product = ({ product }) => {
  const slug = product?.slug;

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, quantity: 1 }));
  };
  return (
    <>
      <div className="col-md-6 col-lg-6 col-xl-4">
        {/* <Link
          href={`/product/${slug}`}
          className="text-decoration-none text-dark"
        > */}
        <div className="rounded position-relative fruite-item">
          <div className="fruite-img">
            <Link
              href={`/product/${slug}`}
              className="text-decoration-none text-dark"
            >
              <Image
                width={200}
                height={200}
                src={product?.images?.[0]?.src}
                className="img-fluid w-100 rounded-top"
                alt={product?.name}
              />
            </Link>
          </div>
          <div
            className="text-white bg-secondary px-3 py-1 rounded position-absolute"
            style={{ top: 10, left: 10 }}
            dangerouslySetInnerHTML={{ __html: product?.categories?.[0].name }}
          />

          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
            <Link
              href={`/product/${slug}`}
              className="text-decoration-none text-dark"
            >
              <h4>{product?.name}</h4>
            </Link>
            <p
              className="product-desc"
              dangerouslySetInnerHTML={{ __html: product?.short_description }}
            />
            <div className="d-flex justify-content-between flex-lg-wrap">
              <p className="text-dark fs-5 fw-bold mb-0">$ {product?.price}</p>
              <button
                className="btn border border-secondary rounded-pill px-3 text-primary"
                onClick={handleAddToCart}
                // disabled={loading}
              >
                <i className="fa fa-shopping-bag me-2 text-primary" />
                Add to cart
                {/* {loading ? "Adding..." : "Add to cart"} */}
              </button>
            </div>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </>
  );
};

export default Product;
