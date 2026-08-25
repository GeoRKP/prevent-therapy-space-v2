import { z } from "zod";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  message: z.string().min(5).max(3000),
  locale: z.enum(["el", "en"]).default("el"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Χωρίς βάση: το μήνυμα προωθείται με email στο ιατρείο μέσω Resend.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: CONTACT_EMAIL,
      replyTo: data.email,
      subject: `Νέο μήνυμα επικοινωνίας — ${data.name}`,
      text: [
        `Όνομα: ${data.name}`,
        `Email: ${data.email}`,
        `Τηλέφωνο: ${data.phone}`,
        "",
        data.message,
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
