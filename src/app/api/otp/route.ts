import { NextResponse } from "next/server";

// Simple in-memory store for OTPs (Replace with Redis/DB in production)
const otpStore = new Map<string, { otp: string; expiry: number }>();

function generateOTP(): string {
   return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
   try {
      const { email } = await request.json();
      const otp = generateOTP();

      // Store OTP with 5-minute expiry
      otpStore.set(email, {
         otp,
         expiry: Date.now() + 5 * 60 * 1000, // 5 minutes
      });

      // Send OTP via email API endpoint
      const emailResponse = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/api/email`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               to: email,
               subject: "Your Event Booking OTP",
               body: `
               <h2>Your OTP for Event Booking</h2>
               <p>Use this OTP to complete your booking: <strong>${otp}</strong></p>
               <p>This OTP will expire in 5 minutes.</p>
            `,
            }),
         }
      );

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
         console.error("Email API error:", emailData);
         throw new Error(emailData.error || "Failed to send email");
      }

      return NextResponse.json({
         success: true,
         message: "OTP sent successfully",
      });
   } catch (error) {
      console.error("OTP generation error:", error);
      return NextResponse.json(
         {
            error: "Failed to generate OTP",
            details: error instanceof Error ? error.message : "Unknown error",
         },
         { status: 500 }
      );
   }
}

export async function PUT(request: Request) {
   try {
      const { email, otp } = await request.json();
      const storedData = otpStore.get(email);

      if (!storedData) {
         return NextResponse.json(
            { error: "No OTP found for this email" },
            { status: 400 }
         );
      }

      if (Date.now() > storedData.expiry) {
         otpStore.delete(email);
         return NextResponse.json(
            { error: "OTP has expired" },
            { status: 400 }
         );
      }

      if (storedData.otp !== otp) {
         return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }

      // Clear the OTP after successful verification
      otpStore.delete(email);

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error("OTP verification error:", error);
      return NextResponse.json(
         { error: "Failed to verify OTP" },
         { status: 500 }
      );
   }
}
