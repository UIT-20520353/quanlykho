import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { RoleMapper } from "@/mappers/staff";
import { Button } from "antd";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";

const StaffManagement = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [ingredientList, setIngredientList] = useState([]);
  const [total, setTotal] = useState(0);

  const onGet = useCallback(async () => {
    const { ok, body } = await userApi.getAllUser({
      pageSize: 10,
      page: pagination.page,
    });
    if (ok && body) {
      setIngredientList(body.data);
      setTotal(body.total);
    }
  }, [pagination.page]);

  const [pendingIngredients, getAllIngredients] = useHandleAsyncRequest(onGet);

  const onPageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (_, record) => <TableDataColumn label={record.id} />,
      },
      {
        title: <TableHeaderColumn label="Tên đăng nhập" />,
        render: (_, record) => <TableDataColumn label={record.username} />,
      },
      {
        dataIndex: "firstName",
        title: <TableHeaderColumn label="Tên" />,
        render: (_, record) => <TableDataColumn label={record.firstName} />,
      },
      {
        title: <TableHeaderColumn label="Họ " />,
        render: (_, record) => <TableDataColumn label={`${record.lastName}`} />,
      },

      {
        title: <TableHeaderColumn label="Phân quyền" />,
        render: (_, record) => (
          <TableDataColumn label={RoleMapper[record.role]} />
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
              onClick={() => navigate(`/users/${record.id}`)}
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getAllIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách người dùng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/users/create")}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingIngredients}
        data={ingredientList}
        onPageChange={onPageChange}
        page={pagination.page}
        isShowPagination={true}
        total={total}
      />
    </div>
  );
};

export default StaffManagement;
