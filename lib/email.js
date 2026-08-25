// Emails κρατήσεων μέσω Resend: επιβεβαίωση/ακύρωση στον ασθενή, ειδοποίηση
// στον θεραπευτή. Όλα best-effort — μια αποτυχία email δεν ακυρώνει ποτέ
// την ίδια την κράτηση. Server-side μόνο.

import { Resend } from "resend";
import { getBookingConfig } from "@/lib/settings";

// Παραλήπτης όλων των ειδοποιήσεων του θεραπευτή (νέες κρατήσεις, ακυρώσεις,
// φόρμα επικοινωνίας). Hardcoded κατόπιν απόφασης — δεν διαβάζεται από env.
export const CONTACT_EMAIL = "geokap94@hotmail.com";

const BRAND = {
  name: "PREVENT Therapy Space",
  green: "#005240",
  mint: "#82d9b9",
  ink: "#0d1117",
  muted: "#5b6470",
};

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function formatWhen(startISO, locale, timeZone) {
  const date = new Date(startISO);
  const dateStr = date.toLocaleDateString(locale === "en" ? "en-GB" : "el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  });
  const timeStr = date.toLocaleTimeString(locale === "en" ? "en-GB" : "el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
  return { dateStr, timeStr };
}

// Απλό, στιβαρό layout για email clients: πίνακες + inline styles.
function renderEmail({ heading, intro, rows, cta, note }) {
  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 16px 6px 0;color:${BRAND.muted};font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:6px 0;color:${BRAND.ink};font-size:14px;font-weight:600;">${value}</td>
        </tr>`
    )
    .join("");

  const ctaHtml = cta
    ? `<tr><td style="padding:26px 32px 0;">
         <a href="${cta.url}" style="display:inline-block;background:${BRAND.green};color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 26px;border-radius:999px;">${cta.label}</a>
       </td></tr>`
    : "";

  const noteHtml = note
    ? `<tr><td style="padding:18px 32px 0;color:${BRAND.muted};font-size:12px;line-height:1.6;">${note}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f2f4f3;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f3;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:${BRAND.green};padding:22px 32px;">
          <span style="color:#ffffff;font-size:16px;font-weight:800;letter-spacing:2px;">PREVENT</span>
          <span style="color:${BRAND.mint};font-size:12px;letter-spacing:1px;"> · THERAPY SPACE</span>
        </td></tr>
        <tr><td style="padding:30px 32px 0;color:${BRAND.ink};font-size:20px;font-weight:800;">${heading}</td></tr>
        <tr><td style="padding:12px 32px 0;color:${BRAND.muted};font-size:14px;line-height:1.6;">${intro}</td></tr>
        <tr><td style="padding:22px 32px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="background:#f6f8f7;border-radius:12px;padding:16px 20px;width:100%;">
            ${rowsHtml}
          </table>
        </td></tr>
        ${ctaHtml}
        ${noteHtml}
        <tr><td style="padding:28px 32px 30px;color:${BRAND.muted};font-size:12px;line-height:1.6;border-top:1px solid #eceeed;margin-top:20px;">
          ${BRAND.name} · <a href="${siteUrl()}" style="color:${BRAND.green};text-decoration:none;">${siteUrl().replace(/^https?:\/\//, "")}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const STRINGS = {
  el: {
    labels: { date: "Ημερομηνία", time: "Ώρα", duration: "Διάρκεια", name: "Ονοματεπώνυμο", phone: "Τηλέφωνο", email: "Email" },
    minutes: (m) => `${m} λεπτά`,
    confirm: {
      subject: (d, t) => `Επιβεβαίωση ραντεβού — ${d}, ${t}`,
      heading: "Το ραντεβού σας επιβεβαιώθηκε",
      intro: (name) => `Γεια σας ${name}, σας περιμένουμε στον χώρο μας. Θα λάβετε και πρόσκληση ημερολογίου Google για να το αποθηκεύσετε.`,
      cta: "Ακύρωση ραντεβού",
      note: (h) => `Αν δεν μπορείτε να έρθετε, ακυρώστε με το παραπάνω κουμπί έως ${h} ώρες πριν το ραντεβού, ώστε η ώρα να ελευθερωθεί για κάποιον άλλον. Μετά από αυτό το όριο, επικοινωνήστε μαζί μας τηλεφωνικά.`,
    },
    cancelled: {
      subject: (d, t) => `Το ραντεβού σας ακυρώθηκε — ${d}, ${t}`,
      heading: "Το ραντεβού ακυρώθηκε",
      intro: (name) => `Γεια σας ${name}, το ραντεβού σας ακυρώθηκε και η ώρα ελευθερώθηκε. Μπορείτε να κλείσετε νέο ραντεβού όποτε σας εξυπηρετεί.`,
      cta: "Νέο ραντεβού",
    },
    rescheduled: {
      subject: (d, t) => `Νέα ώρα ραντεβού — ${d}, ${t}`,
      heading: "Το ραντεβού σας μεταφέρθηκε",
      intro: (name) => `Γεια σας ${name}, η ώρα του ραντεβού σας άλλαξε. Η νέα ώρα φαίνεται παρακάτω — θα ενημερωθεί και η πρόσκληση στο ημερολόγιό σας.`,
      cta: "Ακύρωση ραντεβού",
      note: (h) => `Αν η νέα ώρα δεν σας εξυπηρετεί, μπορείτε να ακυρώσετε έως ${h} ώρες πριν το ραντεβού ή να επικοινωνήσετε μαζί μας.`,
    },
    reminder24: {
      subject: (d, t) => `Υπενθύμιση: το ραντεβού σας είναι αύριο — ${d}, ${t}`,
      heading: "Το ραντεβού σας πλησιάζει",
      intro: (name) => `Γεια σας ${name}, σας υπενθυμίζουμε το αυριανό σας ραντεβού. Σας περιμένουμε!`,
      cta: "Ακύρωση ραντεβού",
      note: (h) => `Αν τελικά δεν μπορείτε να έρθετε, ακυρώστε έγκαιρα (έως ${h} ώρες πριν) ώστε η ώρα να ελευθερωθεί για κάποιον άλλον.`,
    },
    reminder2: {
      subject: (d, t) => `Σε λίγο: το ραντεβού σας στις ${t}`,
      heading: "Τα λέμε σε λίγο",
      intro: (name) => `Γεια σας ${name}, το ραντεβού σας πλησιάζει. Σας περιμένουμε στον χώρο μας — Θεοτοκοπούλου 55, Πατήσια.`,
      note: () => `Αν προκύψει κάτι έκτακτο, ενημερώστε μας τηλεφωνικά.`,
    },
    ownerBooked: {
      subject: (name, d, t) => `Νέα κράτηση — ${name}, ${d} ${t}`,
      heading: "Νέα κράτηση",
      intro: "Καταχωρήθηκε νέο ραντεβού μέσω του site. Υπάρχει ήδη στο Google Calendar σας.",
    },
    ownerCancelled: {
      subject: (name, d, t) => `Ακύρωση ραντεβού — ${name}, ${d} ${t}`,
      heading: "Ακύρωση ραντεβού",
      intro: "Ο ασθενής ακύρωσε το παρακάτω ραντεβού μέσω του site. Το event αφαιρέθηκε από το ημερολόγιό σας και η ώρα είναι ξανά διαθέσιμη.",
    },
  },
  en: {
    labels: { date: "Date", time: "Time", duration: "Duration", name: "Full name", phone: "Phone", email: "Email" },
    minutes: (m) => `${m} minutes`,
    confirm: {
      subject: (d, t) => `Appointment confirmed — ${d}, ${t}`,
      heading: "Your appointment is confirmed",
      intro: (name) => `Hello ${name}, we look forward to seeing you. You will also receive a Google Calendar invitation to save the appointment.`,
      cta: "Cancel appointment",
      note: (h) => `If you can't make it, please cancel with the button above up to ${h} hours before the appointment so the slot frees up for someone else. After that, please contact us by phone.`,
    },
    cancelled: {
      subject: (d, t) => `Your appointment was cancelled — ${d}, ${t}`,
      heading: "Appointment cancelled",
      intro: (name) => `Hello ${name}, your appointment has been cancelled and the slot has been freed. You are welcome to book a new appointment any time.`,
      cta: "Book again",
    },
    rescheduled: {
      subject: (d, t) => `New appointment time — ${d}, ${t}`,
      heading: "Your appointment was moved",
      intro: (name) => `Hello ${name}, the time of your appointment has changed. The new time is below — your calendar invitation will be updated as well.`,
      cta: "Cancel appointment",
      note: (h) => `If the new time does not work for you, you can cancel up to ${h} hours before the appointment, or contact us.`,
    },
    reminder24: {
      subject: (d, t) => `Reminder: your appointment is tomorrow — ${d}, ${t}`,
      heading: "Your appointment is coming up",
      intro: (name) => `Hello ${name}, this is a reminder of your appointment tomorrow. We look forward to seeing you!`,
      cta: "Cancel appointment",
      note: (h) => `If you can no longer make it, please cancel in time (up to ${h} hours before) so the slot frees up for someone else.`,
    },
    reminder2: {
      subject: (d, t) => `Coming up: your appointment at ${t}`,
      heading: "See you soon",
      intro: (name) => `Hello ${name}, your appointment is coming up. We look forward to seeing you — Theotokopoulou 55, Patisia, Athens.`,
      note: () => `If something urgent comes up, please let us know by phone.`,
    },
    ownerBooked: {
      subject: (name, d, t) => `New booking — ${name}, ${d} ${t}`,
      heading: "New booking",
      intro: "A new appointment was booked through the website. It is already in your Google Calendar.",
    },
    ownerCancelled: {
      subject: (name, d, t) => `Booking cancelled — ${name}, ${d} ${t}`,
      heading: "Booking cancelled",
      intro: "The patient cancelled the appointment below through the website. The event was removed from your calendar and the slot is available again.",
    },
  },
};

async function send({ to, subject, html, scheduledAt }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return null;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    ...(scheduledAt ? { scheduledAt } : {}),
  });
  if (error) {
    console.error("[email]", subject, error);
    return null;
  }
  return data?.id || null;
}

/**
 * Emails μετά από επιτυχή κράτηση: επιβεβαίωση + link ακύρωσης στον ασθενή,
 * ειδοποίηση στον θεραπευτή (πάντα στα ελληνικά).
 */
export async function sendBookingEmails({ startISO, name, email, phone, locale, cancelLink }) {
  const config = await getBookingConfig();
  const lang = locale === "en" ? "en" : "el";
  const s = STRINGS[lang];
  const { dateStr, timeStr } = formatWhen(startISO, lang, config.timeZone);
  const duration = s.minutes(config.durationMinutes);

  const patient = send({
    to: email,
    subject: s.confirm.subject(dateStr, timeStr),
    html: renderEmail({
      heading: s.confirm.heading,
      intro: s.confirm.intro(name),
      rows: [
        [s.labels.date, dateStr],
        [s.labels.time, timeStr],
        [s.labels.duration, duration],
      ],
      cta: { label: s.confirm.cta, url: cancelLink },
      note: s.confirm.note(config.cancelNoticeHours),
    }),
  });

  const el = STRINGS.el;
  const gr = formatWhen(startISO, "el", config.timeZone);
  const owner = CONTACT_EMAIL
    ? send({
        to: CONTACT_EMAIL,
        subject: el.ownerBooked.subject(name, gr.dateStr, gr.timeStr),
        html: renderEmail({
          heading: el.ownerBooked.heading,
          intro: el.ownerBooked.intro,
          rows: [
            [el.labels.name, name],
            [el.labels.phone, phone],
            [el.labels.email, email],
            [el.labels.date, gr.dateStr],
            [el.labels.time, gr.timeStr],
          ],
        }),
      })
    : Promise.resolve();

  await Promise.allSettled([patient, owner]);
}

function reminderPayload({ startISO, name, email, locale, kind, cancelLink, config }) {
  const lang = locale === "en" ? "en" : "el";
  const s = STRINGS[lang];
  const tpl = kind === "2h" ? s.reminder2 : s.reminder24;
  const { dateStr, timeStr } = formatWhen(startISO, lang, config.timeZone);

  return {
    to: email,
    subject: tpl.subject(dateStr, timeStr),
    html: renderEmail({
      heading: tpl.heading,
      intro: tpl.intro(name),
      rows: [
        [s.labels.date, dateStr],
        [s.labels.time, timeStr],
        [s.labels.duration, s.minutes(config.durationMinutes)],
      ],
      cta: tpl.cta && cancelLink ? { label: tpl.cta, url: cancelLink } : undefined,
      note: tpl.note(config.cancelNoticeHours),
    }),
  };
}

const HOUR = 3_600_000;

/**
 * Προγραμματίζει τις υπενθυμίσεις (T-24h με link ακύρωσης, T-2h) μέσω Resend
 * scheduled emails — χωρίς cron. Επιστρέφει τα ids των προγραμματισμένων
 * emails ώστε να ακυρωθούν αν ακυρωθεί το ραντεβού.
 */
export async function scheduleReminderEmails({ startISO, name, email, locale, cancelLink }) {
  const config = await getBookingConfig();
  const start = new Date(startISO).getTime();
  const hoursUntil = (start - Date.now()) / HOUR;
  const ids = {};

  // 24ωρη: μόνο αν η κράτηση έγινε αρκετά νωρίτερα — αλλιώς μόλις ήρθε το
  // email επιβεβαίωσης και μια υπενθύμιση θα ήταν θόρυβος.
  if (hoursUntil > 25) {
    const id = await send({
      ...reminderPayload({ startISO, name, email, locale, kind: "24h", cancelLink, config }),
      scheduledAt: new Date(start - 24 * HOUR).toISOString(),
    });
    if (id) ids.reminder24EmailId = id;
  }

  if (hoursUntil > 2.5) {
    const id = await send({
      ...reminderPayload({ startISO, name, email, locale, kind: "2h", config }),
      scheduledAt: new Date(start - 2 * HOUR).toISOString(),
    });
    if (id) ids.reminder2EmailId = id;
  }

  return ids;
}

/** Email στον ασθενή όταν ο θεραπευτής μεταθέσει το ραντεβού σε νέα ώρα. */
export async function sendRescheduledEmail({ startISO, name, email, locale, cancelLink }) {
  const config = await getBookingConfig();
  const lang = locale === "en" ? "en" : "el";
  const s = STRINGS[lang];
  const { dateStr, timeStr } = formatWhen(startISO, lang, config.timeZone);

  await send({
    to: email,
    subject: s.rescheduled.subject(dateStr, timeStr),
    html: renderEmail({
      heading: s.rescheduled.heading,
      intro: s.rescheduled.intro(name),
      rows: [
        [s.labels.date, dateStr],
        [s.labels.time, timeStr],
        [s.labels.duration, s.minutes(config.durationMinutes)],
      ],
      cta: cancelLink ? { label: s.rescheduled.cta, url: cancelLink } : undefined,
      note: s.rescheduled.note(config.cancelNoticeHours),
    }),
  });
}

/** Ακυρώνει προγραμματισμένα emails (best-effort) — π.χ. όταν ακυρωθεί το ραντεβού. */
export async function cancelScheduledEmails(ids) {
  const valid = (ids || []).filter(Boolean);
  if (valid.length === 0 || !process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  await Promise.allSettled(
    valid.map((id) =>
      resend.emails.cancel(id).catch((err) => console.error("[email cancel]", id, err))
    )
  );
}

/** Emails μετά από ακύρωση: επιβεβαίωση στον ασθενή, ειδοποίηση στον θεραπευτή. */
export async function sendCancellationEmails({ startISO, name, email, phone, locale }) {
  const config = await getBookingConfig();
  const lang = locale === "en" ? "en" : "el";
  const s = STRINGS[lang];
  const { dateStr, timeStr } = formatWhen(startISO, lang, config.timeZone);

  const patient = email
    ? send({
        to: email,
        subject: s.cancelled.subject(dateStr, timeStr),
        html: renderEmail({
          heading: s.cancelled.heading,
          intro: s.cancelled.intro(name),
          rows: [
            [s.labels.date, dateStr],
            [s.labels.time, timeStr],
          ],
          cta: { label: s.cancelled.cta, url: `${siteUrl()}/booking` },
        }),
      })
    : Promise.resolve();

  const el = STRINGS.el;
  const gr = formatWhen(startISO, "el", config.timeZone);
  const owner = CONTACT_EMAIL
    ? send({
        to: CONTACT_EMAIL,
        subject: el.ownerCancelled.subject(name, gr.dateStr, gr.timeStr),
        html: renderEmail({
          heading: el.ownerCancelled.heading,
          intro: el.ownerCancelled.intro,
          rows: [
            [el.labels.name, name],
            [el.labels.phone, phone || "—"],
            [el.labels.email, email || "—"],
            [el.labels.date, gr.dateStr],
            [el.labels.time, gr.timeStr],
          ],
        }),
      })
    : Promise.resolve();

  await Promise.allSettled([patient, owner]);
}
