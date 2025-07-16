import { readBody, send, setResponseStatus } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (event) => {
  try {
    const { email, code } = await readBody(event);

    if (!email || !code) {
      setResponseStatus(event, 400);
      return send(event, { message: "Email and code are required." });
    }

    // Look for matching OTP that hasn't expired
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(), // not expired
        },
      },
    });

    if (!otpRecord) {
      setResponseStatus(event, 401);
      return send(event, { message: "Invalid or expired OTP." });
    }

    // Optionally delete the OTP after successful verification
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    return send(event, { message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    setResponseStatus(event, 500);
    return send(event, { message: "Server error: " + error.message });
  }
};
