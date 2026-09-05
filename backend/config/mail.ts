import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Tạo transporter SMTP dùng chung cho cả app
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,   // true nếu dùng port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Hàm gửi email tái sử dụng cho toàn app
export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"Nhà Sách Trực Tuyến" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Đã gửi email tới: ${to}`);
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error);
    // KHÔNG throw lỗi - email lỗi không nên crash cả request
  }
}