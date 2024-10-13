import React from "react";
import ProductEditor from "../widgets/ProductEditor";
import PageHeader from "@layout/PageHeader";

const CreateProduct = () => {
  return (
    <>
      <PageHeader title="Tạo mới sản phẩm" />
      <ProductEditor type="create" />;
    </>
  );
};

export default CreateProduct;
