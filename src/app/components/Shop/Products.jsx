import React from "react";
import Product from "./Product";

const Products = ({ products }) => {
  return (
    <>
      <div className="row g-4 justify-content-center">
        {products.map((e, i) => {
          return <Product key={i} product={e} />;
        })}

        <div className="col-12">
          <div className="pagination d-flex justify-content-center mt-5">
            <a href="#" className="rounded">
              «
            </a>
            <a href="#" className="active rounded">
              1
            </a>
            <a href="#" className="rounded">
              2
            </a>
            <a href="#" className="rounded">
              3
            </a>
            <a href="#" className="rounded">
              4
            </a>
            <a href="#" className="rounded">
              5
            </a>
            <a href="#" className="rounded">
              6
            </a>
            <a href="#" className="rounded">
              »
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
