import axiosClient from "./axiosClient";

export const getProductApi = async () => {
  return await axiosClient.get("/product");
};

export const getProductByIdApi = async (id) => {

  return await axiosClient.get(`/product/${id}`);
};

export const createProductApi = async  (data, header)=>{
  return await axiosClient.post( `/product`, data)
}

export const updateProductByIdApi = async (id, updateProduct, config) => {
  console.log("first", id, updateProduct);
  try {
    return await axiosClient.put(`/product/${id}`, updateProduct, config);
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};

export const deleteProductApi = async (id) => {
  console.log("delete");
  return await axiosClient.delete(`/product/${id}`);
};
