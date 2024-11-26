import importApi from "@/api/importApi";
import productApi from "@/api/productApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button, Form, Select } from "antd";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdateImportRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [products, setProducts] = useState([]);
  const [error, setError] = useState({});
  const [importDetail, setImportDetail] = useState(undefined);

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        label: p.name,
        value: p.id,
      })),
    [products]
  );

  const [pendingGetImportById, getImportById] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body, error } = await importApi.getImportById(id);
      if (ok && body) {
        setImportDetail(body);
      }
      if (error) {
        handleResponseError(error, () => navigate("/import"));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, handleResponseError])
  );

  const conertToBody = useCallback(
    (data) => ({
      importDetails: data.importDetails.map((recipe) => ({
        ...recipe,
        quantity: replaceCommaWithEmptyString(recipe.quantity),
      })),
    }),
    []
  );

  const onFieldsChange = useCallback(() => {
    const length = form.getFieldValue("importDetails")?.length ?? -1;
    const errorStates = {};
    for (let i = 0; i < length; i++) {
      errorStates[`importDetails${i}quantity`] =
        form.getFieldError(["importDetails", i, "quantity"]).length > 0;
    }

    setError(errorStates);
  }, [form]);

  const [pendingGetProducts, getAllProducts] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await productApi.getAllProduct({
        page: 1,
        size: 9999,
      });
      if (ok && body) {
        setProducts(body.data);
      }
    }, [])
  );

  const [pendingCreateRecord, createRecord] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, errors } = await importApi.createImportRecord(data);
        if (ok) {
          handleResponseSuccess("Tạo đơn hàng thành công", () =>
            navigate("/import")
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleResponseSuccess, handleResponseError]
    )
  );

  const onSubmit = (data) => {
    if (!data.importDetails || data.importDetails.length === 0) {
      handleResponseError({
        message: "error.validate.form.product-required",
      });
    } else {
      createRecord(conertToBody(data));
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    dispatch(pendingGetProducts ? incrementLoading() : decrementLoading());
    dispatch(pendingCreateRecord ? incrementLoading() : decrementLoading());
  }, [pendingGetProducts, dispatch, pendingCreateRecord]);
  useEffect(() => {
    dispatch(pendingGetImportById ? incrementLoading() : decrementLoading());
  }, [pendingGetImportById, dispatch]);

  useEffect(() => {
    getImportById();
  }, [getImportById]);

  useEffect(() => {
    if (importDetail) {
      form.setFieldsValue({
        importDetails: importDetail.importDetails.map((record) => ({
          quantity: record.quantity,
          productId: record.product.id,
        })),
      });
    }
  }, [importDetail, form]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Nhập hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/import")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <Form
        className="flex flex-col items-start w-full p-5 bg-white rounded-md "
        layout="vertical"
        onFieldsChange={onFieldsChange}
        form={form}
        onFinish={onSubmit}
      >
        <Form.List name="importDetails">
          {(fields, { add, remove }, { errors }) => (
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex items-center justify-between col-span-2">
                <h3 className="text-lg font-medium underline">Sản phẩm</h3>
                <Button
                  type="primary"
                  icon={<Plus size={24} />}
                  className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
                  onClick={() => add()}
                >
                  Thêm sản phẩm
                </Button>
              </div>

              {fields.map((field, i) => (
                <div
                  key={field.key}
                  className="grid w-full grid-cols-12 col-span-2 gap-3"
                >
                  <Form.Item
                    label={
                      <span className="text-base font-exo-2">Sản phẩm</span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn sản phẩm",
                      },
                    ]}
                    name={[field.name, "productId"]}
                    className="col-span-5"
                  >
                    <Select
                      options={productOptions}
                      placeholder="Chọn sản phẩm"
                      className="h-10"
                      variant="filled"
                    />
                  </Form.Item>
                  <NumberField
                    name={[field.name, "quantity"]}
                    placeholder="Nhập số lượng"
                    label="Số lượng"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng",
                      },
                    ]}
                    isError={error[`importDetails${i}quantity`]}
                    thousandSeparator=","
                    className="col-span-5"
                  />
                  <div className="flex items-center justify-center col-span-2">
                    <button
                      onClick={() => remove(field.name)}
                      className="flex items-center justify-center w-8 h-8 duration-300 rounded-full bg-red-1 hover:bg-red-2"
                    >
                      <Minus size={20} color="#fff" />
                    </button>
                  </div>
                </div>
              ))}

              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>

        <div className="flex items-center justify-center w-full">
          <div className="w-1/3">
            <SubmitButton text="Lưu" className="mt-2" />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateImportRecord;