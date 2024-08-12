import axiosClient from "./axiosClient";

export const getProductApi = async() => {
    return await axiosClient.get("/product");
};

export const getProductByIdApi = async(id) => {
    return await axiosClient.get(`/product/${id}`);
};

export const updateProductByIdApi = async(id, updateProduct) => {
    console.log("first", id, updateProduct);
    return await axiosClient.put(`/product/${id}`, updateProduct);
};

export const deleteProductApi = async(id) => {
    console.log("delete");
    return await axiosClient.delete(`/product/${id}`);
};