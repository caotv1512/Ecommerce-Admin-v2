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
import { useEffect, useState } from "react";
import { getCategoryApi } from "../api/categoryApis";

const ProductEditor = (id) => {
  console.log(id);
  const [product, setProduct] = useState({});
  const [categoryId, setCategoryId] = useState(0);
  const [updateProduct, setUpdateProduct] = useState({
    image: [],
    description: "",
    name: "",
    categoryId: categoryId,
    price: 10000,
    stock: 0,
  });
  const [category, setCategory] = useState([]);
  // lay thong tin category
  const getCategory = async () => {
    const result = await getCategoryApi();
    console.log(result);
    setCategory(result.data);
  };
  // lay thong tin san pham can sua
  const getOneProduct = async (id) => {
    const result = await getProductByIdApi(id.id);
    console.log(result);
    setProduct(result.data);
  };
  console.log(product);
  useEffect(() => {
    getOneProduct(id);
    getCategory();
  }, [id]);

  //   const categories = PRODUCT_CATEGORIES.filter(category => category.value !== 'all');
  const categories = category.filter((category) => category.value !== "all");
  console.log(categories, "===========");
  const productDescription = `${product?.description}`;
  const defaultValues = {
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    description: product?.description,
    productName: product?.name,
    category: product?.category?.name,
    regularPrice: 1000,
    salePrice: 800,
    productSchedule: [dayjs().startOf("week"), dayjs().endOf("week")],
    qty: product?.stock,
    unit: UNITS_OPTIONS[0],
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  // do something with the data
  const handlePublish = (data) => {
    console.log(data);
    toast.success("Product published successfully");
  };

  // do something with the data
  const handleSaveUpdate = async (event) => {
    if (event) {
      event.preventDefault(); // Ngăn chặn hành vi mặc định nếu event tồn tại
    }
    // Thực hiện hành động khác
    console.log("Thông tin đã được lưu!");
    await updateProductByIdApi(id.id, updateProduct);
  };
  const getCategoryId = (value) => {
    console.log(value);
    setCategoryId(value.id);
  };
  return (
    <Spring className="card flex-1 xl:py-10">
      <h5 className="mb-[15px]">Chỉnh sửa sản phẩm</h5>
      <form className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,550px)] xl:gap-10">
        <div>
          <div>
            <span className="block field-label mb-2.5">Ảnh sản phẩm</span>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4 2xl:grid-cols-[repeat(5,minmax(0,1fr))]">
              <Controller
                name="image1"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DropFiles
                    wrapperClass="media-dropzone 2xl:col-span-2"
                    onChange={(files) => field.onChange(files)}
                  >
                    <MediaDropPlaceholder />
                  </DropFiles>
                )}
              />
              <Controller
                name="image2"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DropFiles
                    wrapperClass="media-dropzone 2xl:col-span-2"
                    onChange={(files) => field.onChange(files)}
                  >
                    <MediaDropPlaceholder />
                  </DropFiles>
                )}
              />
              <div className="grid grid-cols-2 col-span-2 gap-5 2xl:col-span-1 2xl:grid-cols-1">
                <Controller
                  name="image3"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <DropFiles
                      wrapperClass="media-dropzone"
                      onChange={(files) => field.onChange(files)}
                    >
                      <MediaDropPlaceholder />
                    </DropFiles>
                  )}
                />
                <Controller
                  name="image4"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <DropFiles
                      wrapperClass="media-dropzone"
                      onChange={(files) => field.onChange(files)}
                    >
                      <MediaDropPlaceholder />
                    </DropFiles>
                  )}
                />
              </div>
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
                defaultValue={defaultValues.description}
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
              defaultValue={defaultValues.productName}
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
                defaultValue={defaultValues.category}
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
                defaultValue={defaultValues.regularPrice}
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
                defaultValue={defaultValues.salePrice}
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
                defaultValue={defaultValues.productSchedule}
                render={({ field }) => (
                  <RangeDatePicker
                    id="productSchedule"
                    innerRef={field.ref}
                    disableFuture={false}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
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
                  defaultValue={defaultValues.qty}
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
          <div className="field-wrapper">
            <span className="field-label">Payment Methods</span>
            <div className="flex flex-wrap gap-5">
              {PAYMENT_OPTIONS.map((option, index) => (
                <PaymentMethod key={index} id={option.value} option={option} />
              ))}
              <button
                className="img-wrapper !bg-transparent w-[60px] h-10"
                onClick={(e) => e.preventDefault()}
                aria-label="Add payment methods"
              >
                <i className="icon-plus-regular text-[12px]" />
              </button>
            </div>
          </div>
          <div className="grid gap-2 mt-5 sm:grid-cols-2 sm:mt-10 md:mt-11">
            <button className="btn btn--secondary" onClick={handleSaveUpdate}>
              Lưu thông tin
            </button>
          </div>
        </div>
      </form>
    </Spring>
  );
};

export default ProductEditor;
