import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: 587,
   secure: false,
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
   },
});

// POST handler for sending emails
export async function POST(request: Request) {
   try {
      const { to, subject, body } = await request.json();

      await transporter.sendMail({
         from: process.env.FROM_EMAIL,
         to,
         subject,
         html: body,
      });

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
         { error: "Failed to send email" },
         { status: 500 }
      );
   }
}
