import Spring from "@components/Spring";
import Select from "@ui/Select";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  getProductByIdApi,
  updateProductByIdApi,
  createProductApi,
} from "../api/productApis";
import { getCategoryApi } from "../api/categoryApis";

const ProductEditor = ({ id, type }) => {
  const [product, setProduct] = useState({});
  const [category, setCategory] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageInputs, setImageInputs] = useState([""]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const [updateProduct, setUpdateProduct] = useState({
    images: [],
    description: "",
    name: "",
    categoryId: 0,
    price: 10000,
    stock: 0,
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      const categoryResult = await getCategoryApi();
      setCategory(categoryResult.data);
    };
    console.log(type, 'DCMMMMm');
    

    if (type === "edit") {
      const fetchProductData = async () => {
        const productResult = await getProductByIdApi(id);

        setProduct(productResult.data);
        setUpdateProduct({
          name: productResult.data.name,
          description: productResult.data.description,
          categoryId: productResult.data.category.id,
          price: productResult.data.price,
          stock: productResult.data.stock,
          images: productResult.data.images || [],
        });
        setSelectedFiles(productResult.data.images || []);
        setValue("name", productResult.data.name);
        setValue("description", productResult.data.description);
        setValue("stock", productResult.data.stock);
        setValue("category", productResult.data.category.id);
        setValue("price", productResult.data.price);
        setImageInputs(productResult.data.images.length ? productResult.data.images : []);
      };
  
      fetchProductData();
    }
    console.log(imageInputs, '=================');

    fetchCategoryData();
  }, [id, setValue, type]);

  const categories = category.filter((cat) => cat.value !== "all");

  const handleSaveUpdate = async (data) => {
    const formData = new FormData();

    formData.append("name", updateProduct.name);
    formData.append("description", updateProduct.description);
    formData.append("price", updateProduct.price);
    formData.append("stock", updateProduct.stock);
    formData.append("categoryId", updateProduct.categoryId);

    selectedFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      } else {
        formData.append("existingImages", file.url); // Sử dụng URL ảnh có sẵn
      }
    });

    try {
      let response;
      if (type === "create") {
        response = await createProductApi(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await updateProductByIdApi(id, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response) {
        toast.success(
          type === "create"
            ? "Tạo sản phẩm thành công!"
            : "Cập nhật sản phẩm thành công!"
        );
      } else {
        toast.error("Có lỗi xảy ra khi xử lý sản phẩm.");
      }
    } catch (error) {
      console.error("Error during product creation/update:", error);
      toast.error("Có lỗi xảy ra trong quá trình xử lý.");
    }
  };

  const handleAddImageInput = () => {
    if (imageInputs.length < 4) {
      setImageInputs((prev) => [...prev, ""]);
    }
  };

  const handleImageChange = (index, file) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index] = file;
    setSelectedFiles(updatedFiles);

    const updatedImages = [...updateProduct.images];
    updatedImages[index] = file;
    setUpdateProduct((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      handleImageChange(index, file);
    }
  };

  const handleRemoveImageInput = (index) => {
    setImageInputs((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    const updatedImages = [...updateProduct.images];
    updatedImages.splice(index, 1); // Xóa ảnh tại vị trí chỉ định
    setUpdateProduct((prev) => ({ ...prev, images: updatedImages }));
  };

  return (
    <Spring className="card flex-1 xl:py-10">
      <h5 className="mb-[15px]">
        {type === "create" ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
      </h5>
      <form
        className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10"
        onSubmit={handleSubmit(handleSaveUpdate)}
      >
        <div>
        <div>
            <span className="block field-label mb-2.5">Ảnh sản phẩm</span>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
              {imageInputs.map((image, index) => (
                <div key={index} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <div className="bg-gray-200 h-40 w-40 flex items-center justify-center border-2 border-dashed border-gray-400 relative">
                    {selectedFiles[index] ? (
                      <img
                        src={
                          selectedFiles[index] instanceof File
                            ? URL.createObjectURL(selectedFiles[index])
                            : selectedFiles[index].url // Hiển thị URL ảnh từ API
                        }
                        alt="Selected"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-500">Chọn ảnh</span>
                    )}
                    {image.url && (
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
            <label className="field-label" htmlFor="name">
              Tên sản phẩm
            </label>
            <input
              className={classNames("field-input", {
                "field-input--error": errors.name,
              })}
              id="name"
              placeholder="Nhập tên sản phẩm"
              {...register("name", { required: true })}
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
                      (option) => option.id === field.value
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
              <label className="field-label" htmlFor="stock">
                Số lượng tồn kho
              </label>
              <input
                type="number"
                className={classNames("field-input", {
                  "field-input--error": errors.stock,
                })}
                id="stock"
                placeholder="Nhập số lượng tồn kho"
                {...register("stock", { required: true })}
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
          <button type="submit" className="btn btn--primary">
            {type === "create" ? "Tạo sản phẩm" : "Cập nhật sản phẩm"}
          </button>
        </div>
      </form>
    </Spring>
  );
};

export default ProductEditor;
