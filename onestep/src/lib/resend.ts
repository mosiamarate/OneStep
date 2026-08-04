import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailFrom =
  process.env.EMAIL_FROM || "OneStep <onboarding@resend.dev>";

export const supportEmail =
  process.env.SUPPORT_EMAIL || "support@onestepapp.co.za";
