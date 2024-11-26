import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { Button } from "antd";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import productApi from "../../api/productApi";
import { NumericFormat } from "react-number-format";

const ProductManagement = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [data, setData] = useState({ items: [], total: 0 });

  const onGet = useCallback(async () => {
    const { ok, body } = await productApi.getAllProduct({
      pageSize: 10,
      page: pagination.page,
    });
    if (ok && body) {
      setData({ items: body.data, total: body.total });
    }
  }, [pagination.page]);

  const [pendingIngredients, getAllIngredients] = useHandleAsyncRequest(onGet);

  const onPageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  //   id: number;
  //   name: string;
  //   price: number;
  //   cost: number;
  //   quantity: number;
  //   categoryId: number;

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (_, record) => <TableDataColumn label={record.id} />,
      },
      {
        title: <TableHeaderColumn label="Tên sản phẩm" />,
        render: (_, record) => <TableDataColumn label={record.name} />,
      },
      {
        dataIndex: "cost",
        title: <TableHeaderColumn label="Giá nhập" />,
        render: (_, record) => (
          <TableDataColumn
            label={
              <NumericFormat
                displayType="text"
                value={record.cost}
                thousandSeparator=","
              />
            }
          />
        ),
      },
      {
        title: <TableHeaderColumn label="Giá bán" />,
        render: (_, record) => (
          <TableDataColumn
            label={
              <NumericFormat
                displayType="text"
                value={record.price}
                thousandSeparator=","
              />
            }
          />
        ),
      },
      {
        title: <TableHeaderColumn label="Số lượng" />,
        render: (_, record) => (
          <TableDataColumn
            label={
              <NumericFormat
                displayType="text"
                value={record.quantity}
                thousandSeparator=","
              />
            }
          />
        ),
      },
      {
        title: <TableHeaderColumn label="Danh mục" />,
        render: (_, record) => <TableDataColumn label={record.category.name} />,
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
        <h3 className="text-xl font-semibold">Danh sách sản phẩm</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/products/add")}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingIngredients}
        data={data.items}
        onPageChange={onPageChange}
        page={pagination.page}
        isShowPagination={true}
        total={data.total}
      />
    </div>
  );
};

export default ProductManagement;
