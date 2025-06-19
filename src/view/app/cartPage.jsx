"use client";
import {
  addToCart,
  applyCoupon,
  fetchCartItems,
  removeCoupon,
  removeFromCart,
  updateItemInCart,
} from "@/redux/slices/cartSlice";
import { decodeHTMLEntities } from "@/utils/decodeHtmlEntities";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CartDetailPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [updatingItemKey, setUpdatingItemKey] = useState(null);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart); // full cart object
  console.log(cart, "cart");

  const cartItems = cart.items || [];

  // Remove cart
  const handleRemove = (cartKey) => {
    dispatch(removeFromCart(cartKey));
  };

  // // increment cart
  // const handleIncrement = (cartKey, currentQty) => {
  //   dispatch(updateItemInCart({ cartKey, quantity: currentQty + 1 }));
  // };

  // // decrement cart
  // const handleDecrement = (cartKey, currentQty) => {
  //   if (currentQty <= 1) return; // Prevent 0 or negative quantities

  //   dispatch(updateItemInCart({ cartKey, quantity: currentQty - 1 }));
  // };

  const handleIncrement = async (cartKey, currentQty) => {
    setUpdatingItemKey(cartKey);
    await dispatch(updateItemInCart({ cartKey, quantity: currentQty + 1 }));
    setUpdatingItemKey(null);
  };

  const handleDecrement = async (cartKey, currentQty) => {
    if (currentQty <= 1) return;
    setUpdatingItemKey(cartKey);
    await dispatch(updateItemInCart({ cartKey, quantity: currentQty - 1 }));
    setUpdatingItemKey(null);
  };
  // apply coupon function

  const handleApplyCoupon = async () => {
    setCouponError("");

    const resultAction = await dispatch(applyCoupon(couponCode));

    if (applyCoupon.rejected.match(resultAction)) {
      const message = resultAction.payload?.message;
      setCouponError(decodeHTMLEntities(message) || "Failed to apply coupon");
    }
  };
  // remove coupon function

  const handleRemoveCoupon = (couponCode) => {
    dispatch(removeCoupon(couponCode));
  };

  // fetch cart
  useEffect(() => {
    dispatch(fetchCartItems());
  }, []);

  return (
    <>
      {/* Single Page Header start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Pages</a>
          </li>
          <li className="breadcrumb-item active text-white">Cart</li>
        </ol>
      </div>
      {/* Single Page Header End */}
      {/* Cart Page Start */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Products</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((e, i) => {
                  return (
                    <tr key={i}>
                      <th scope="row">
                        <div className="d-flex align-items-center">
                          <Image
                            width={100}
                            height={100}
                            src={
                              e?.images?.[0]?.src ||
                              "/images/vegetable-item-3.png"
                            }
                            style={{ width: "auto", height: "auto" }}
                            className="img-fluid me-5 rounded-circle"
                            alt={e.name}
                          />
                        </div>
                      </th>
                      <td>
                        <p className="mb-0 mt-4">{e?.name}</p>
                      </td>
                      <td>
                        <p className="mb-0 mt-4"> {e?.prices.price} $</p>
                      </td>
                      <td>
                        <div
                          className="input-group quantity mt-4"
                          style={{ width: 100 }}
                        >
                          <div className="input-group-btn">
                            <button
                              type="button"
                              disabled={e.quantity <= 1}
                              onClick={() =>
                                handleDecrement(e?.key, e?.quantity)
                              }
                              className="btn btn-sm btn-minus rounded-circle bg-light border"
                            >
                              <i className="fa fa-minus" />
                            </button>
                          </div>
                          {/* <input
                            type="text"
                            className="form-control form-control-sm text-center border-0"
                            value={e?.quantity}
                            readOnly
                          /> */}
                          <input
                            type="text"
                            className="form-control form-control-sm text-center border-0"
                            value={
                              updatingItemKey === e.key ? "..." : e?.quantity
                            }
                            readOnly
                          />
                          <div className="input-group-btn">
                            <button
                              onClick={() =>
                                handleIncrement(e?.key, e?.quantity)
                              }
                              className="btn btn-sm btn-plus rounded-circle bg-light border"
                            >
                              <i className="fa fa-plus" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="mb-0 mt-4">
                          {e?.totals?.line_subtotal} $
                        </p>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemove(e?.key)}
                          className="btn btn-md rounded-circle bg-light border mt-4"
                        >
                          <i className="fa fa-times text-danger" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <input
              type="text"
              className="border-0 border-bottom rounded me-5 py-3 mb-4"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={() => handleApplyCoupon(couponCode)}
              className="btn border-secondary rounded-pill px-4 py-3 text-primary"
              type="button"
            >
              Apply Coupon
            </button>
            {couponError && <p className="text-danger">{couponError}</p>}
          </div>
          <div className="row g-4 justify-content-end">
            <div className="col-8" />
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
              <div className="bg-light rounded">
                <div className="p-4">
                  <h1 className="display-6 mb-4">
                    Cart <span className="fw-normal">Total</span>
                  </h1>
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="mb-0 me-4">Subtotal:</h5>
                    <p className="mb-0">${cart?.totals?.total_items}</p>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0 me-4">Shipping</h5>
                    <div className="">
                      <p className="mb-0">Flat rate: $0.00</p>
                    </div>
                  </div>

                  {cart?.coupons?.length > 0 && (
                    <>
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-0 me-4">Discount</h5>
                        <div>
                          <p className="mb-0 text-success">
                            - {cart?.totals?.total_discount || "0.00"}
                          </p>
                        </div>
                      </div>

                      <p className="text-success mt-2">
                        {cart?.coupons?.[0]?.code} Coupon applied successfully!
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCoupon(cart?.coupons?.[0]?.code)
                        }
                        className="btn border-secondary rounded-pill px-2 py-2 text-primary text-uppercase mt-2 fs-6"
                      >
                        Remove Coupon
                      </button>
                    </>
                  )}
                </div>
                <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                  <h5 className="mb-0 ps-4 me-4">Total</h5>
                  <p className="mb-0 pe-4">${cart?.totals?.total_price}</p>
                </div>
                <Link
                  href="checkout"
                  className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                  type="button"
                >
                  Proceed Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Page End */}
    </>
  );
};

export default CartDetailPage;
