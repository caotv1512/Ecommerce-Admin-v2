import React from "react";
import ProductEditor from "./ProductEditor";

const UpdateProduct = ({ id }) => {
  return <ProductEditor id={id} type="update" />;
};

export default UpdateProduct;
