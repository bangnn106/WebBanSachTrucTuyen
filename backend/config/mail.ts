import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Tao transporter SMTP dung chung cho ca app
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,   // true neu dung port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Ham gui email tai su dung cho toan app
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
    // KHONG throw loi - email loi khong nen crash ca request
  }
}