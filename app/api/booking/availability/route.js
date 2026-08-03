import { getAvailability } from "@/lib/booking";

// Η διαθεσιμότητα διαβάζεται πάντα ζωντανά από το Google Calendar.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const availability = await getAvailability();
    return Response.json(availability, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[booking/availability]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
