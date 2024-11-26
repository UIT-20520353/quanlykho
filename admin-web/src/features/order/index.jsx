import orderApi from "@/api/orderApi";
import productApi from "@/api/productApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useConfirmModal from "@/hooks/useConfirmModal";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { OrderStatusMapper } from "@/mappers/order";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button } from "antd";
import dayjs from "dayjs";
import { Pencil, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const showConfirmModal = useConfirmModal();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [data, setData] = useState({ items: [], total: 0 });

  const [pendingGetAllOrders, getAllOrders] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await orderApi.getAllOrders({
        pageSize: 10,
        page: pagination.page,
      });
      if (ok && body) {
        setData({ items: body.data, total: body.total });
      }
    }, [pagination])
  );

  const onPageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const [pendingDelete, deleteProduct] = useHandleAsyncRequest(
    useCallback(
      async (id) => {
        const { ok, errors } = await productApi.deleteProduct(id);

        if (ok) {
          handleResponseSuccess("Xóa sản phẩm thành công", () =>
            setPagination({
              page: 1,
            })
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      [handleResponseSuccess, handleResponseError]
    )
  );

  const onDeleteProduct = useCallback(
    (record) => {
      showConfirmModal({
        message: `Bạn có chắc chắn muốn sản phẩm ${record.name} không?`,
        onOk: () => deleteProduct(record.id),
      });
    },
    [showConfirmModal, deleteProduct]
  );

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (_, record) => <TableDataColumn label={record.id} />,
      },
      {
        dataIndex: "user",
        title: <TableHeaderColumn label="Người tạo" />,
        render: (user) => (
          <TableDataColumn label={`${user.firstName} ${user.lastName}`} />
        ),
      },
      {
        dataIndex: "createdDate",
        title: <TableHeaderColumn label="Ngày tạo" />,
        render: (createdDate) => (
          <TableDataColumn
            label={dayjs(new Date(createdDate)).format("DD/MM/YYYY HH:mm:ss")}
          />
        ),
      },
      {
        dataIndex: "status",
        title: <TableHeaderColumn label="Trạng thái" />,
        render: (status) => (
          <TableDataColumn label={OrderStatusMapper[status]} />
        ),
      },
      // {
      //   title: <TableHeaderColumn label="Số lượng" />,
      //   render: (_, record) => (
      //     <TableDataColumn
      //       label={
      //         <NumericFormat
      //           displayType="text"
      //           value={record.quantity}
      //           thousandSeparator=","
      //         />
      //       }
      //     />
      //   ),
      // },
      // {
      //   title: <TableHeaderColumn label="Danh mục" />,
      //   render: (_, record) => <TableDataColumn label={record.category.name} />,
      // },
      {
        title: <TableHeaderColumn label="Thao tác" />,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => navigate(`/orders/${record.id}`)}
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => onDeleteProduct(record)}
              danger
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteProduct]
  );

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  useEffect(() => {
    if (pendingDelete) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingDelete, dispatch]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách đơn hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/orders/create")}
          >
            Thêm đơn hàng
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingGetAllOrders}
        data={data.items}
        onPageChange={onPageChange}
        page={pagination.page}
        isShowPagination={true}
        total={data.total}
      />
    </div>
  );
};

export default OrderManagement;
