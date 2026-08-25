// Κλειστές ημέρες (άδειες/αργίες): all-day events στο Calendar που μπλοκάρουν
// τη διαθεσιμότητα. GET λίστα, POST κλείσιμο ημέρας, DELETE άνοιγμα ξανά.

import { z } from "zod";
import { isAuthorized } from "@/lib/admin-auth";
import {
  createClosureEvent,
  listClosureEvents,
  deleteBookingEvent,
} from "@/lib/google-calendar";
import { getBookingConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const config = await getBookingConfig();
    const now = new Date();
    const until = new Date(now.getTime() + (config.maxAdvanceDays + 60) * 86_400_000);
    const events = await listClosureEvents(now, until);
    return Response.json({
      closures: events.map((e) => ({ id: e.id, date: e.start?.date })),
    });
  } catch (err) {
    console.error("[admin/closures GET]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const { date } = z
      .object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })
      .parse(await request.json());
    const event = await createClosureEvent(date);
    return Response.json({ success: true, id: event.id });
  } catch (err) {
    if (err?.issues) return Response.json({ error: "validation" }, { status: 400 });
    console.error("[admin/closures POST]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "invalid" }, { status: 400 });
    await deleteBookingEvent(id);
    return Response.json({ success: true });
  } catch (err) {
    if (err?.status === 404 || err?.status === 410) {
      return Response.json({ success: true });
    }
    console.error("[admin/closures DELETE]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
