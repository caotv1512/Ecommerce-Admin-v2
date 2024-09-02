import React from "react";
import ProductEditor from "../widgets/ProductEditor";
import PageHeader from "@layout/PageHeader";

const CreateProduct = () => {
  return (
    <>
      <PageHeader title="Product Editor" />
      <ProductEditor type="create" />;
    </>
  );
};

export default CreateProduct;
