import importApi from "@/api/importApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useConfirmModal from "@/hooks/useConfirmModal";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button } from "antd";
import dayjs from "dayjs";
import { Pencil, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ImportManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const showConfirmModal = useConfirmModal();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [data, setData] = useState({ items: [], total: 0 });

  const [pendingGetAllImportRecords, getAllImportRecords] =
    useHandleAsyncRequest(
      useCallback(async () => {
        const { ok, body } = await importApi.getAllImportRecords({
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

  const [pendingDelete, deleteImportRecord] = useHandleAsyncRequest(
    useCallback(
      async (id) => {
        const { ok, errors } = await importApi.deleteImportRecord(id);

        if (ok) {
          handleResponseSuccess("Xóa phiếu nhập thành công", () =>
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

  const onDeleteRecord = useCallback(
    (record) => {
      showConfirmModal({
        message: `Bạn có chắc chắn muốn xóa phiếu nhập này không?`,
        onOk: () => deleteImportRecord(record.id),
      });
    },
    [showConfirmModal, deleteImportRecord]
  );

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (_, record) => <TableDataColumn label={record.id} />,
      },
      {
        dataIndex: "importDetails",
        title: <TableHeaderColumn label="Sản phẩm" />,
        render: (importDetails) => (
          <TableDataColumn
            label={
              <p className="text-wrap max-w-80">
                {importDetails.map((record) => record.product.name).join(", ")}
              </p>
            }
          />
        ),
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
        title: <TableHeaderColumn label="Thao tác" />,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => navigate(`/import/${record.id}`)}
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => onDeleteRecord(record)}
              danger
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteRecord]
  );

  useEffect(() => {
    getAllImportRecords();
  }, [getAllImportRecords]);

  useEffect(() => {
    if (pendingDelete) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingDelete, dispatch]);
  useEffect(() => {
    if (pendingGetAllImportRecords) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingGetAllImportRecords, dispatch]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách phiếu nhập hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/import/create")}
          >
            Thêm phiếu nhập
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingGetAllImportRecords}
        data={data.items}
        onPageChange={onPageChange}
        page={pagination.page}
        isShowPagination={true}
        total={data.total}
      />
    </div>
  );
};

export default ImportManagement;
