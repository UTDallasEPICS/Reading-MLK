import { readBody, send, setResponseStatus } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, code } = body;

  console.log("Incoming OTP verification for:", email);
  console.log("Received code:", code);

  // Simple validation
  if (!email || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing email or OTP code.",
    });
  }

  const record = await prisma.oTP.findUnique({ where: { email } });

  console.log("Email:", email);
  console.log("Stored OTP:", record?.code);
  console.log("Provided OTP:", code);

  if (!record || record.code !== code) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid OTP",
    });
  }

  // Delete OTP after use
  await prisma.oTP.delete({ where: { email } });

  return { success: true, message: "OTP verified" };
});
