// Ρυθμίσεις κρατήσεων του admin: GET τρέχουσες τιμές, PUT αποθήκευση στη Neon.

import { z } from "zod";
import { isAuthorized } from "@/lib/admin-auth";
import { getBookingConfig, saveBookingConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

const range = z
  .object({ from: z.string().regex(timeRe), to: z.string().regex(timeRe) })
  .refine((r) => r.from < r.to, { message: "from must be before to" });

const schema = z.object({
  durationMinutes: z.number().int().min(10).max(240),
  minNoticeHours: z.number().min(0).max(72),
  cancelNoticeHours: z.number().min(0).max(72),
  // Έως 30 μέρες: τόσο επιτρέπει και ο προγραμματισμός emails στο Resend.
  maxAdvanceDays: z.number().int().min(1).max(30),
  workingHours: z
    .object({
      0: z.array(range).max(3).nullable(),
      1: z.array(range).max(3).nullable(),
      2: z.array(range).max(3).nullable(),
      3: z.array(range).max(3).nullable(),
      4: z.array(range).max(3).nullable(),
      5: z.array(range).max(3).nullable(),
      6: z.array(range).max(3).nullable(),
    })
    .refine(
      (wh) => Object.values(wh).some((ranges) => ranges && ranges.length > 0),
      { message: "at least one open day" }
    ),
});

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const config = await getBookingConfig();
  const { timeZone, ...editable } = config;
  return Response.json(editable);
}

export async function PUT(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const data = schema.parse(await request.json());
    await saveBookingConfig(data);
    return Response.json({ success: true });
  } catch (err) {
    if (err?.issues) {
      return Response.json({ error: "validation", issues: err.issues }, { status: 400 });
    }
    console.error("[admin/settings]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
