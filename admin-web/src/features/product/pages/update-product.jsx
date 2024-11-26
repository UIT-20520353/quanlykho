import categoryApi from "@/api/categoryApi";
import productApi from "@/api/productApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button, Form, Select } from "antd";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const [categoryList, setCategoryList] = useState({ total: 0, items: [] });
  const [error, setError] = useState({ cost: false, price: false });
  const [product, setProduct] = useState(undefined);

  const onGetProductDetail = useCallback(async () => {
    const { ok, errors, body } = await productApi.getProductDetail(id);

    if (ok && body) {
      setProduct(body);
    }

    if (errors) {
      handleResponseError(errors, () => navigate("/products"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, handleResponseError]);
  const [pendingGetProductDetailt, getProductDetail] =
    useHandleAsyncRequest(onGetProductDetail);

  const onGet = useCallback(async () => {
    const { ok, body } = await categoryApi.getAllCategories({
      pageSize: 999,
      page: 1,
    });
    if (ok && body) {
      setCategoryList({ items: body.data, total: body.total });
    }
  }, []);
  const [pendingGetAllCategories, getAllCategories] =
    useHandleAsyncRequest(onGet);

  const onUpdate = useCallback(
    async (data) => {
      const { ok, errors } = await productApi.updateProduct(id, {
        ...data,
        cost: replaceCommaWithEmptyString(data.cost),
        price: replaceCommaWithEmptyString(data.price),
      });

      if (ok) {
        handleResponseSuccess("Cập nhật thông tin sản phẩm thành công", () => {
          navigate("/products");
        });
      }

      if (errors) {
        handleResponseError(errors);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleResponseError, handleResponseSuccess, id]
  );
  const [pendingUpdate, updateProduct] = useHandleAsyncRequest(onUpdate);

  const onFieldsChange = useCallback(() => {
    setError({
      cost: form.getFieldError("cost").length > 0,
      price: form.getFieldError("price").length > 0,
    });
  }, [form]);

  useEffect(() => {
    getAllCategories();
    getProductDetail();
  }, [getAllCategories, getProductDetail]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        cost: product.cost,
        categoryId: product.category.id,
      });
    }
  }, [product, form]);

  useEffect(() => {
    if (pendingGetProductDetailt) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingGetProductDetailt, dispatch]);
  useEffect(() => {
    if (pendingGetAllCategories) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingGetAllCategories, dispatch]);
  useEffect(() => {
    if (pendingUpdate) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingUpdate, dispatch]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Cập nhật thông tin sản phẩm</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <Form
        className="grid w-full grid-cols-2 gap-3 p-5 bg-white rounded-md"
        layout="vertical"
        onFinish={updateProduct}
        form={form}
        onFieldsChange={onFieldsChange}
      >
        <TextField
          name="name"
          label="Tên sản phẩm"
          variant="filled"
          placeholder="Nhập tên sản phẩm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên sản phẩm",
            },
          ]}
        />

        <Form.Item
          label={<span className="text-base font-exo-2">Danh mục</span>}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn danh mục",
            },
          ]}
          name="categoryId"
        >
          <Select
            options={categoryList.items.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            placeholder="Chọn danh mục"
            className="h-10 text-base font-exo-2"
            variant="filled"
          />
        </Form.Item>

        <NumberField
          name="cost"
          label="Giá nhập"
          variant="filled"
          placeholder="Nhập giá nhập"
          maxLength={15}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá nhập",
            },
          ]}
          isError={error.cost}
        />
        <NumberField
          name="price"
          label="Giá bán"
          variant="filled"
          placeholder="Nhập giá bán"
          maxLength={15}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá bán",
            },
          ]}
          isError={error.price}
        />

        <div className="flex items-center justify-center col-span-2">
          <div className="w-1/3">
            <SubmitButton text="Lưu" className="mt-2" loading={pendingUpdate} />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateProduct;
