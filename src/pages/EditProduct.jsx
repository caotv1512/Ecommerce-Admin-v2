// components
import PageHeader from "@layout/PageHeader";
import ProductEditor from "@widgets/ProductEditor";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  return (
    <>
      <PageHeader title="Product Editor" />
      <ProductEditor id={id} />
    </>
  );
};

export default EditProduct;
