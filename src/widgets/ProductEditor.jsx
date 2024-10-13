// components
import Spring from "@components/Spring";
import Select from "@ui/Select";
import RangeDatePicker from "@ui/RangeDatePicker";
import DropFiles from "@components/DropFiles";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { createProduct, getProductByIdApi, updateProductByIdApi } from "../api/productApis";
import { getCategoryApi } from "../api/categoryApis";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

const ProductEditor = ({ id, type }) => {

    const [product, setProduct] = useState({});
    const [category, setCategory] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageInputs, setImageInputs] = useState([""]);
    const [updateProduct, setUpdateProduct] = useState({
        image: [],
        description: "",
        name: "",
        categoryId: 0,
        price: 10000,
        stock: 0,
    });
    const [linkImages, setLinkImages] = useState([]);
    const [progressList, setProgressList] = useState([]);
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
            // console.log(productResult);

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
        // console.log(selectedFiles, '========');

        const fetchCategoryData = async () => {
            const categoryResult = await getCategoryApi();
            setCategory(categoryResult.data);
        };

        fetchProductData();
        fetchCategoryData();
    }, [id, setValue]);

    const categories = category.filter((cat) => cat.value !== "all");

    const handleUpload = async (imageFiles) => {
        const uploadPromises = [];
        const tempProgressList = [];
        const imageLinks = []; // Mảng chứa các link của ảnh
    
        Array.from(imageFiles).forEach((file, index) => {
            const storageRef = ref(storage, `images/${file.name}`);
    
            // Tạo upload task cho từng file
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            // Theo dõi tiến trình của từng file
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    tempProgressList[index] = progress;
                    setProgressList([...tempProgressList]); // Cập nhật tiến trình lên state
                },
                (error) => {
                    console.error("Upload failed: ", error);
                },
                async () => {
                    // Lấy URL sau khi upload thành công
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    imageLinks.push(downloadURL); // Thêm URL vào mảng
                }
            );
    
            uploadPromises.push(uploadTask);
        });
    
        // Chờ cho tất cả các file được tải lên
        await Promise.all(uploadPromises); // Đợi cho tất cả các upload hoàn tất
        
        try {
            const response = await createProduct({
                ...updateProduct,
                image: [...imageLinks]
            });
    
            if (response) {
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
            }
        } catch (error) {
            console.log(error)
            toast.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
        }
        // return imageLinks;
    };
    

    const handleSaveUpdate = async (event) => {
        event.preventDefault();
        await handleUpload(imageInputs);
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
            const newImageInputs = [...imageInputs];
            newImageInputs[index] = file;

            const newImageUrl = URL.createObjectURL(file);
            handleImageChange(index, newImageUrl);
            setImageInputs(newImageInputs);
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
                                        id={`image-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, index)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="bg-gray-200 h-40 w-40 flex items-center justify-center border-2 border-dashed border-gray-400 relative">
                                        {selectedFiles[index] ? (
                                            <img
                                                src={selectedFiles[index]}
                                                alt="Selected"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <label htmlFor={`image-${index}`} className="text-gray-500">Chọn ảnh</label>
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

                    <div>
        {progressList.map((progress, index) => (
          <p key={index}>Tiến độ của file {index + 1}: {progress}%</p>
        ))}
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

