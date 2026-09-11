"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Tao transporter SMTP dung chung cho ca app
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // true neu dung port 465
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
// Ham gui email tai su dung cho toan app
async function sendMail(to, subject, html) {
    try {
        await transporter.sendMail({
            from: `"Nhà Sách Trực Tuyến" <${process.env.MAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 Đã gửi email tới: ${to}`);
    }
    catch (error) {
        console.error('❌ Lỗi gửi email:', error);
        // KHONG throw loi - email loi khong nen crash ca request
    }
}
//# sourceMappingURL=mail.js.map