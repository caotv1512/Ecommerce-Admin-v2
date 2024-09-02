// components
import Spring from "@components/Spring";
import Select from "@ui/Select";
import RangeDatePicker from "@ui/RangeDatePicker";
import DropFiles from "@components/DropFiles";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getProductByIdApi, updateProductByIdApi } from "../api/productApis";
import { getCategoryApi } from "../api/categoryApis";

const ProductEditor = ({ id, type }) => {
  const [product, setProduct] = useState({});
  const [category, setCategory] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [updateProduct, setUpdateProduct] = useState({
    image: [],
    description: "",
    name: "",
    categoryId: 0,
    price: 10000,
    stock: 0,
  });
  const [imageInputs, setImageInputs] = useState([""]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchProductData = async () => {
      const productResult = await getProductByIdApi(id);
      console.log(productResult);
      
      setProduct(productResult.data);
      setUpdateProduct({
        name: productResult.data.name,
        description: productResult.data.description,
        categoryId: productResult.data.category.id,
        price: productResult.data.price,
        stock: productResult.data.stock,
        image: productResult.data.image || [], // Lưu các ảnh hiện có
      });
      setSelectedFiles(productResult.data.images || []);
      setValue("productName", productResult.data.name);
      setValue("description", productResult.data.description);
      setValue("qty", productResult.data.stock);
      setValue("category", productResult.data.category.name);
    };
console.log(selectedFiles, '========');

    const fetchCategoryData = async () => {
      const categoryResult = await getCategoryApi();
      setCategory(categoryResult.data);
    };

    fetchProductData();
    fetchCategoryData();
  }, [id, setValue]);

  const categories = category.filter((cat) => cat.value !== "all");

  const handleSaveUpdate = async (event) => {
    event.preventDefault();
    console.log("Thông tin đã được lưu!");
    console.log("Updated Product Information:", updateProduct);

    const formData = new FormData();

    formData.append("name", updateProduct.name);
    formData.append("description", updateProduct.description);
    formData.append("price", updateProduct.price);
    formData.append("stock", updateProduct.stock);
    formData.append("categoryId", updateProduct.categoryId);

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const response = await updateProductByIdApi(id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response) {
      toast.success("Cập nhật sản phẩm thành công!");
    } else {
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  const handleAddImageInput = () => {
    if (imageInputs.length < 4) {
      setImageInputs((prev) => [...prev, ""]); // Thêm một input mới vào mảng nếu chưa đạt 4 ảnh
    }
  };

  const handleImageChange = (index, file) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index] = file; // Cập nhật file cho ô input tương ứng
    setSelectedFiles(updatedFiles);

    const updatedImages = [...updateProduct.image];
    updatedImages[index] = file; // Cập nhật ảnh cho ô input tương ứng
    setUpdateProduct((prev) => ({ ...prev, image: updatedImages }));
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      handleImageChange(index, newImageUrl);
    }
  };

  const handleRemoveImageInput = (index) => {
    setImageInputs((prev) => prev.filter((_, i) => i !== index)); // Xóa input tương ứng
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index)); // Xóa file tương ứng
    const updatedImages = [...updateProduct.image];
    updatedImages[index] = ""; // Đặt ảnh tương ứng về trống
    setUpdateProduct((prev) => ({ ...prev, image: updatedImages }));
  };

  return (
    <Spring className="card flex-1 xl:py-10">
      <h5 className="mb-[15px]">
        {type === "create" ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
      </h5>
      <form
        className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10"
        onSubmit={handleSaveUpdate}
      >
        <div>
          <div>
            <span className="block field-label mb-2.5">Ảnh sản phẩm</span>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
              {imageInputs.map((_, index) => (
                <div key={index} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="bg-gray-200 h-40 w-40 flex items-center justify-center border-2 border-dashed border-gray-400 relative">
                    {selectedFiles[index] ? (
                      <img
                        src={selectedFiles[index].url}
                        alt="Selected"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-500">Chọn ảnh</span>
                    )}
                    {selectedFiles[index] && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageInput(index)}
                        className="absolute top-1 right-1 text-red-600"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddImageInput}
              className="btn btn--secondary mt-2"
              disabled={imageInputs.length >= 4}
            >
              Thêm ảnh
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="field-wrapper">
              <label className="field-label" htmlFor="description">
                Mô tả sản phẩm
              </label>
              <textarea
                className={classNames(
                  `field-input !h-[160px] !py-[15px] !overflow-y-auto`,
                  {
                    "field-input--error": errors.description,
                  }
                )}
                id="description"
                {...register("description", { required: true })}
                onChange={(e) => {
                  setUpdateProduct({
                    ...updateProduct,
                    description: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-4 gap-x-2">
          <div className="field-wrapper">
            <label className="field-label" htmlFor="productName">
              Tên sản phẩm
            </label>
            <input
              className={classNames("field-input", {
                "field-input--error": errors.productName,
              })}
              id="productName"
              placeholder="Enter product name"
              {...register("productName", { required: true })}
              onChange={(e) => {
                setUpdateProduct({ ...updateProduct, name: e.target.value });
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
            <div className="field-wrapper">
              <label className="field-label" htmlFor="category">
                Loại sản phẩm
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    isInvalid={errors.category}
                    id="category"
                    placeholder="Chọn loại sản phẩm"
                    options={categories}
                    value={categories.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selectedOption) =>
                      setUpdateProduct({
                        ...updateProduct,
                        categoryId: selectedOption.id,
                      })
                    }
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
          <div className="field-wrapper">
              <label className="field-label" htmlFor="qty">
                Số lượng
              </label>
              <input
                type="number"
                className={classNames("field-input", {
                  "field-input--error": errors.qty,
                })}
                id="qty"
                placeholder="Nhập số lượng"
                {...register("qty", { required: true })}
                onChange={(e) => {
                  setUpdateProduct({
                    ...updateProduct,
                    stock: e.target.value,
                  });
                }}
              />
            </div>
            <div className="field-wrapper">
              <label className="field-label" htmlFor="price">
                Giá sản phẩm
              </label>
              <input
                type="number"
                className={classNames("field-input", {
                  "field-input--error": errors.price,
                })}
                id="price"
                placeholder="Nhập giá"
                {...register("price", { required: true })}
                onChange={(e) => {
                  setUpdateProduct({
                    ...updateProduct,
                    price: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn--primary"
          >
            {type === "create" ? "Tạo sản phẩm" : "Cập nhật sản phẩm"}
          </button>
        </div>
      </form>
    </Spring>
  );
};

export default ProductEditor;

