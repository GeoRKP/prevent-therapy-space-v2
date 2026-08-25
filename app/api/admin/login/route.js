import {
  checkPassword,
  createSessionToken,
  sessionCookieHeader,
  clearCookieHeader,
  isAuthorized,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!checkPassword(body.password)) {
    // Μικρή καθυστέρηση κατά brute-force
    await new Promise((r) => setTimeout(r, 700));
    return Response.json({ error: "invalid" }, { status: 401 });
  }
  return Response.json(
    { success: true },
    { headers: { "Set-Cookie": sessionCookieHeader(createSessionToken()) } }
  );
}

export async function DELETE() {
  return Response.json(
    { success: true },
    { headers: { "Set-Cookie": clearCookieHeader() } }
  );
}

export async function GET(request) {
  return Response.json({ authorized: isAuthorized(request) });
}
