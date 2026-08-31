// ========== TEMPLATE EMAIL XÁC NHẬN ĐƠN HÀNG ==========
export function orderConfirmationTemplate(data: {
  ma_don_hang: string;
  ten_nguoi_nhan: string;
  dia_chi_giao_hang: string;
  so_dien_thoai_nhan: string;
  tong_tien: number;
  ngay_dat: string;
  chi_tiet: Array<{
    ten_sach: string;
    so_luong: number;
    don_gia: number;
    thanh_tien: number;
  }>;
}): string {
  // Tạo các dòng trong bảng chi tiết sản phẩm
  const rows = data.chi_tiet
    .map(
      (item, i) => `
      <tr>
        <td style="padding:8px; border:1px solid #ddd; text-align:center">${i + 1}</td>
        <td style="padding:8px; border:1px solid #ddd">${item.ten_sach}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:center">${item.so_luong}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:right">
          ${item.don_gia.toLocaleString('vi-VN')}đ
        </td>
        <td style="padding:8px; border:1px solid #ddd; text-align:right">
          ${item.thanh_tien.toLocaleString('vi-VN')}đ
        </td>
      </tr>`
    )
    .join('');

  return `
    <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px">
      <h2 style="color:#2563eb; text-align:center">📦 Xác Nhận Đơn Hàng</h2>
      <p>Xin chào <strong>${data.ten_nguoi_nhan}</strong>,</p>
      <p>Đơn hàng <strong style="color:#2563eb">${data.ma_don_hang}</strong> 
         đã được đặt thành công!</p>
      
      <div style="background:#f8fafc; padding:15px; border-radius:8px; margin:15px 0">
        <p><strong>Ngày đặt:</strong> ${data.ngay_dat}</p>
        <p><strong>Địa chỉ giao:</strong> ${data.dia_chi_giao_hang}</p>
        <p><strong>SĐT nhận hàng:</strong> ${data.so_dien_thoai_nhan}</p>
      </div>

      <table style="width:100%; border-collapse:collapse; margin:15px 0">
        <thead>
          <tr style="background:#2563eb; color:white">
            <th style="padding:10px; border:1px solid #ddd">STT</th>
            <th style="padding:10px; border:1px solid #ddd">Tên sách</th>
            <th style="padding:10px; border:1px solid #ddd">SL</th>
            <th style="padding:10px; border:1px solid #ddd">Đơn giá</th>
            <th style="padding:10px; border:1px solid #ddd">Thành tiền</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p style="text-align:right; font-size:18px">
        <strong>Tổng cộng: 
          <span style="color:#dc2626">${data.tong_tien.toLocaleString('vi-VN')}đ</span>
        </strong>
      </p>

      <p style="color:#6b7280; font-size:13px; text-align:center; margin-top:30px">
        Cảm ơn bạn đã mua sắm tại Nhà Sách Trực Tuyến! 📚
      </p>
    </div>
  `;
}

// ========== TEMPLATE EMAIL THÔNG BÁO HỦY ĐƠN ==========
export function orderCancelledTemplate(data: {
  ma_don_hang: string;
  ten_nguoi_nhan: string;
  tong_tien: number;
  ly_do: string;
}): string {
  return `
    <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; padding:20px">
      <h2 style="color:#dc2626; text-align:center">❌ Đơn Hàng Đã Bị Hủy</h2>
      <p>Xin chào <strong>${data.ten_nguoi_nhan}</strong>,</p>
      <p>Đơn hàng <strong>${data.ma_don_hang}</strong> đã bị hủy.</p>
      
      <div style="background:#fef2f2; padding:15px; border-radius:8px; 
                  margin:15px 0; border-left:4px solid #dc2626">
        <p><strong>Lý do:</strong> ${data.ly_do || 'Không có lý do cụ thể'}</p>
        <p><strong>Tổng tiền:</strong> ${data.tong_tien.toLocaleString('vi-VN')}đ</p>
      </div>

      <p>Nếu bạn có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ.</p>
      
      <p style="color:#6b7280; font-size:13px; text-align:center; margin-top:30px">
        Nhà Sách Trực Tuyến 📚
      </p>
    </div>
  `;
}
