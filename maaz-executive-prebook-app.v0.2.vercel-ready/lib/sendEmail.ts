import nodemailer from "nodemailer";
export async function sendEmail(to:string, subject:string, text:string){
  if(!process.env.SMTP_HOST) return;
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT||587), secure:false, auth:{ user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({ from: `Maaz Executive <no-reply@maazexecutive.co.uk>`, to, subject, text });
}
