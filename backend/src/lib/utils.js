import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};

export const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `"UniNote" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code – UniNote",
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:auto;padding:32px;background:#fafafa;border:1px solid #e2e8f0;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:28px;">📚</span>
          <h2 style="color:#2563EB;margin:8px 0 0;font-size:22px;">UniNote</h2>
        </div>
        <h3 style="color:#1E293B;font-size:18px;margin-bottom:8px;">Verify your email</h3>
        <p style="color:#64748B;font-size:14px;line-height:1.6;">Enter the code below to complete your registration. It expires in <strong>10 minutes</strong>.</p>
        <div style="text-align:center;margin:28px 0;">
          <span style="display:inline-block;background:#2563EB;color:#fff;font-size:28px;font-weight:700;padding:14px 32px;border-radius:10px;letter-spacing:6px;">${otp}</span>
        </div>
        <p style="color:#94A3B8;font-size:12px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:11px;text-align:center;color:#CBD5E1;">© ${new Date().getFullYear()} UniNote. All rights reserved.</p>
      </div>`,
  });
};
