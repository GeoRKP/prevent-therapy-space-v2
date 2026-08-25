// Υπενθυμίσεις ραντεβού: καλείται περιοδικά (κάθε ~30') από εξωτερικό cron
// (GitHub Actions / cron-job.org / Vercel Cron) με το CRON_SECRET.
//
// Στέλνει στον ασθενή:
//   - 24ωρη υπενθύμιση (με link ακύρωσης) όταν το ραντεβού απέχει 3–24 ώρες
//   - 2ωρη υπενθύμιση όταν απέχει 0,5–2,5 ώρες
// Idempotency χωρίς βάση: κάθε αποστολή σημαδεύεται πάνω στο ίδιο το event
// (extendedProperties.private.reminded24 / reminded2), ώστε να μη σταλεί ξανά.

import {
  listBookingEventsBetween,
  patchBookingEventProps,
} from "@/lib/google-calendar";
import { sendReminderEmail } from "@/lib/email";
import { cancelUrl } from "@/lib/booking-token";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HOUR = 3_600_000;

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const { searchParams } = new URL(request.url);
  return searchParams.get("secret") === secret;
}

export async function GET(request) {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const now = Date.now();
    const events = await listBookingEventsBetween(
      new Date(now),
      new Date(now + 25 * HOUR)
    );

    let sent24 = 0;
    let sent2 = 0;
    const failures = [];

    for (const event of events) {
      const props = event.extendedProperties?.private || {};
      const startISO = event.start?.dateTime;
      const email = props.patientEmail;
      if (!startISO || !email) continue;

      const hoursUntil = (new Date(startISO).getTime() - now) / HOUR;
      const base = {
        startISO,
        name: props.patientName || "",
        email,
        locale: props.patientLocale || "el",
      };

      try {
        if (!props.reminded2 && hoursUntil >= 0.5 && hoursUntil <= 2.5) {
          await sendReminderEmail({ ...base, kind: "2h" });
          await patchBookingEventProps(event.id, { reminded2: "1" });
          sent2 += 1;
        } else if (!props.reminded24 && hoursUntil > 3 && hoursUntil <= 24) {
          await sendReminderEmail({
            ...base,
            kind: "24h",
            cancelLink: cancelUrl(event.id),
          });
          await patchBookingEventProps(event.id, { reminded24: "1" });
          sent24 += 1;
        }
      } catch (err) {
        // Ένα προβληματικό event δεν σταματά τα υπόλοιπα.
        console.error("[reminders]", event.id, err);
        failures.push(event.id);
      }
    }

    return Response.json({
      checked: events.length,
      sent24,
      sent2,
      failures: failures.length,
    });
  } catch (err) {
    console.error("[reminders]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
