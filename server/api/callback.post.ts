import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const idToken = body?.id_token;

  if (!idToken) {
    console.error('No id_token in callback body', body);
    return await sendRedirect(event, '/');
  }

  // Decode token to get claims (for dev). For production, verify signature using JWKS.
  const claims: any = jwt.decode(idToken);
  const email: string | undefined = claims?.email || claims?.preferred_username;

  if (!email) {
    console.error('Email not found in id_token claims', claims);
    // still set token but redirect to home/login
    setCookie(event, 'rhtoken', idToken);
    return await sendRedirect(event, '/');
  }

  try {
    // Ensure a user record exists (upsert). This prevents "email not found" on middleware.
    const user = await client.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        user_name: email,
        first_name: claims?.given_name || '',
        last_name: claims?.family_name || '',
        role: 'student'
      }
    });

    // Set cookies for token and user
    setCookie(event, 'rhtoken', idToken);
    setCookie(event, 'rhuser', JSON.stringify(user));
    console.log('Logged in:', email);
    return await sendRedirect(event, '/');
  } catch (e) {
    console.error('Error upserting user on callback:', e);
    return await sendRedirect(event, '/');
  }
});