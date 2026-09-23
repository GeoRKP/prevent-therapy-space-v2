import { z } from "zod";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/email";
import { validateContact } from "@/lib/form-validation";

// Το zod ελέγχει μόνο τύπους/υπερβολικά μεγέθη· οι κανόνες περιεχομένου
// (και τα μηνύματά τους) είναι οι ίδιοι με της φόρμας: lib/form-validation.js.
// Το τηλέφωνο είναι προαιρετικό — αν δοθεί, πρέπει να είναι έγκυρο.
const schema = z.object({
  name: z.string().max(1000),
  email: z.string().max(1000),
  phone: z.string().max(200).optional().default(""),
  message: z.string().max(20000),
  locale: z.enum(["el", "en"]).default("el"),
  // Ρητή συναίνεση (GDPR) — υποχρεωτική για την αποστολή (validateContact)
  consent: z.boolean().optional().default(false),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const fields = validateContact(data);
    if (Object.keys(fields).length) {
      return Response.json({ error: "validation", fields }, { status: 400 });
    }
    const name = data.name.trim();
    const email = data.email.trim();
    const phone = data.phone.trim();

    // Χωρίς βάση: το μήνυμα προωθείται με email στο ιατρείο μέσω Resend.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Νέο μήνυμα επικοινωνίας — ${name}`,
      text: [
        `Όνομα: ${name}`,
        `Email: ${email}`,
        `Τηλέφωνο: ${phone || "—"}`,
        "",
        data.message.trim(),
      ].join("\n"),
    });
    if (error) throw new Error(error.message);

    return Response.json({ success: true });
  } catch (err) {
    if (err.issues) {
      return Response.json({ error: "validation", issues: err.issues }, { status: 400 });
    }
    console.error("[contact]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
