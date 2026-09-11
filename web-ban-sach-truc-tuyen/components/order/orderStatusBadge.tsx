interface Props {
  status: string;
}

const statusMap: Record<string, { label: string; className: string }> = {
  CHO_XAC_NHAN: { label: "Chờ xác nhận", className: "cho-xac-nhan" },
  DA_XAC_NHAN: { label: "Đã xác nhận", className: "da-xac-nhan" },
  DANG_GIAO: { label: "Đang giao", className: "dang-giao" },
  DA_GIAO: { label: "Đã giao", className: "da-giao" },
  DA_HUY: { label: "Đã hủy", className: "da-huy" },
};

export default function OrderStatusBadge({ status }: Props) {
  const info = statusMap[status] || { label: status, className: "" };
  return <span className={`order-status ${info.className}`}>{info.label}</span>;
}
