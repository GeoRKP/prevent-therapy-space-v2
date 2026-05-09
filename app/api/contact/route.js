import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().min(5),
  locale: z.enum(["el", "en"]).default("el"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await prisma.contactMessage.create({ data });

    // TODO: send email via Resend / Nodemailer
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({...});

    return Response.json({ success: true });
  } catch (err) {
    if (err.issues) {
      return Response.json({ error: "validation", issues: err.issues }, { status: 400 });
    }
    console.error("[contact]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
