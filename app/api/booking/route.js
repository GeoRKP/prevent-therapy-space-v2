import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  service: z.string(),
  date: z.string(),
  time: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  notes: z.string().optional().default(""),
  locale: z.enum(["el", "en"]).default("el"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Find or create the service stub for now
    let service = await prisma.service.findFirst({ where: { id: data.service } });
    if (!service) {
      service = await prisma.service.create({
        data: {
          id: data.service,
          nameEl: data.service,
          nameEn: data.service,
          descEl: "",
          descEn: "",
        },
      });
    }

    const date = new Date(data.date);
    const [h, m] = data.time.split(":").map(Number);
    const startTime = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const endHour = h + 1;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: service.id,
        patientName: data.name,
        patientEmail: data.email,
        patientPhone: data.phone,
        date,
        startTime,
        endTime,
        notes: data.notes,
        locale: data.locale,
      },
    });

    // TODO: send confirmation email via Resend / Nodemailer

    return Response.json({ success: true, id: appointment.id });
  } catch (err) {
    if (err.issues) {
      return Response.json({ error: "validation", issues: err.issues }, { status: 400 });
    }
    console.error("[booking]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
