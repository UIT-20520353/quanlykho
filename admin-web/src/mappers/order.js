const StatusMapper = {
  ORDERING: "Đang gọi món",
  SERVE: "Đang phục vụ",
  PAY: "Đã thanh toán",
  CANCEL: "Đã hủy",
};

const StatusColorMapper = {
  ORDERING: "processing",
  SERVE: "green",
  PAY: "gold",
  CANCEL: "red",
};

const OrderStatusMapper = {
  NEW: "Mới",
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
};

export { StatusMapper, StatusColorMapper, OrderStatusMapper };
