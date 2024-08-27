// components
import Spring from "@components/Spring";
import Select from "@ui/Select";
import RangeDatePicker from "@ui/RangeDatePicker";
import DropFiles from "@components/DropFiles";
import PaymentMethod from "@ui/PaymentMethod";
import { toast } from "react-toastify";
import MediaDropPlaceholder from "@ui/MediaDropPlaceholder";

// hooks
import { useForm, Controller } from "react-hook-form";

// constants
import {
  PRODUCT_CATEGORIES,
  PAYMENT_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  PROMOTIONAL_OPTIONS,
  STOCK_STATUS_OPTIONS,
  UNITS_OPTIONS,
} from "@constants/options";

// utils
import classNames from "classnames";
import dayjs from "dayjs";
import { getProductByIdApi, updateProductByIdApi } from "../api/productApis";
import React, { useEffect, useState } from "react";
import { getCategoryApi } from "../api/categoryApis";

const ProductEditor = ({ id }) => {
  const [product, setProduct] = useState({});
  const [category, setCategory] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // Hoặc kiểu dữ liệu phù hợp

  const [updateProduct, setUpdateProduct] = useState({
    image: [],
    description: "",
    name: "",
    categoryId: 0,
    price: 10000,
    stock: 0,
  });

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
      setProduct(productResult.data);
      setUpdateProduct({
        ...updateProduct,
        name: productResult.data.name,
        description: productResult.data.description,
        categoryId: productResult.data.category.id,
        price: productResult.data.price,
        stock: productResult.data.stock,
      });
      setValue("productName", productResult.data.name);
      setValue("description", productResult.data.description);
      setValue("qty", productResult.data.stock);
      setValue("category", productResult.data.category.name);
    };

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

    // Tạo đối tượng FormData
    const formData = new FormData();

    // Thêm thông tin sản phẩm vào FormData
    formData.append("name", updateProduct.name);
    formData.append("description", updateProduct.description);
    formData.append("price", updateProduct.price);
    formData.append("stock", updateProduct.stock);
    formData.append("categoryId", updateProduct.categoryId);
    formData.append("images", selectedFiles); // Giả định rằng backend sẽ nhận file dưới tên 'images'

    // Thêm các file hình ảnh vào FormData
    selectedFiles.forEach((file, index) => {
      formData.append(`images`, file); // 'images' là tên mà NestJS @UploadedFiles sẽ nhận
    });
    // Log dữ liệu trước khi gửi
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const response = await updateProductByIdApi(id, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo Content-Type là multipart/form-data
      },
    });

    if (response) {
      toast.success("Cập nhật sản phẩm thành công!");
    } else {
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files)); // Chuyển đổi FileList thành mảng
    }
  };

  return (
    <Spring className="card flex-1 xl:py-10">
      <h5 className="mb-[15px]">Chỉnh sửa sản phẩm</h5>
      <form
        className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10"
        onSubmit={handleSaveUpdate}
      >
        <div>
          <div>
            <span className="block field-label mb-2.5">Ảnh sản phẩm</span>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
              {product?.images?.map((image, index) => (
                <React.Fragment key={image.id}>
                  <Controller
                    name={`image${index + 1}`} // Sử dụng tên động cho từng ảnh
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <DropFiles
                        wrapperClass="media-dropzone 2xl:col-span-2"
                        onChange={(files) => {
                          field.onChange(files);
                          if (files.length > 0) {
                            console.log(
                              "file đã chọn cho ảnh có id: ",
                              image.id,
                              index
                            );

                            // Cập nhật sản phẩm với ảnh mới
                            const images = [...product.images];
                            images[index].url = URL.createObjectURL(files[0]); // Cập nhật URL ảnh mới
                            setProduct({ ...product, images });

                            // Cập nhật trạng thái updateProduct với ảnh mới
                            setUpdateProduct((prev) => ({
                              ...prev,
                              image: images, // Cập nhật ảnh vào updateProduct
                            }));

                            // Cập nhật selectedFiles
                            setSelectedFiles((prevFiles) => [
                              ...prevFiles,
                              files[0],
                            ]); // Thêm ảnh mới vào selectedFiles
                          }
                        }}
                      >
                        <img src={image.url} alt="Selected" />
                      </DropFiles>
                    )}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="field-wrapper">
              <label className="field-label" htmlFor="description">
                Mô tả sản phẩm
              </label>
              <textarea
                className={classNames(
                  `field-input !h-[160px] !py-[15px] !overflow-y-auto`,
                  { "field-input--error": errors.description }
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
              <label className="field-label" htmlFor="regularPrice">
                Giá chính thức
              </label>
              <input
                className={classNames("field-input", {
                  "field-input--error": errors.regularPrice,
                })}
                id="regularPrice"
                placeholder="$99.99"
                {...register("regularPrice", {
                  required: true,
                  pattern: /^[0-9]*$/,
                })}
                onChange={(e) => {
                  setUpdateProduct({
                    ...updateProduct,
                    price: e.target.value,
                  });
                }}
              />
            </div>
            <div className="field-wrapper">
              <label className="field-label" htmlFor="salePrice">
                Giảm giá
              </label>
              <input
                className={classNames("field-input", {
                  "field-input--error": errors.salePrice,
                })}
                id="salePrice"
                placeholder="$99.99"
                {...register("salePrice", {
                  required: true,
                  pattern: /^[0-9]*$/,
                })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
            <div className="field-wrapper">
              <label className="field-label" htmlFor="productSchedule">
                Thời gian bán
              </label>
              <Controller
                name="productSchedule"
                control={control}
                render={({ field }) => (
                  <RangeDatePicker
                    id="productSchedule"
                    innerRef={field.ref}
                    disableFuture={false}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-2">
            <div className="grid grid-cols-1 gap-y-4 gap-x-2 sm:grid-cols-[minmax(0,1fr)_,minmax(0,112px)]">
              <div className="field-wrapper">
                <label className="field-label" htmlFor="qty">
                  Số lượng
                </label>
                <input
                  className={classNames("field-input", {
                    "field-input--error": errors.qty,
                  })}
                  id="qty"
                  placeholder="0"
                  {...register("qty", {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Only numeric values are allowed",
                    },
                  })}
                  onChange={(e) => {
                    setUpdateProduct({
                      ...updateProduct,
                      stock: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          {/* <div className="field-wrapper">
            <span className="field-label">Payment Methods</span>
            <div className="flex flex-wrap gap-5">
              {PAYMENT_OPTIONS.map((option, index) => (
                <PaymentMethod key={index} id={option.value} option={option} />
              ))}
              <button
                className="img-wrapper !bg-transparent hover:opacity-70 flex items-center justify-center w-10 h-10 rounded-full"
                onClick={() => console.log("Add new payment method")}
              >
                <img
                  className="w-full h-full object-cover"
                  src="/icons/plus.svg"
                  alt="Add payment method"
                />
              </button>
            </div>
          </div> */}
          <div className="field-wrapper">
            <div className="flex flex-wrap gap-2">
              <div className="grid gap-2 mt-5 sm:grid-cols-2 sm:mt-10 md:mt-11">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleSaveUpdate} // Gọi hàm cập nhật khi nhấn nút
                >
                  Lưu thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Spring>
  );
};

export default ProductEditor;
