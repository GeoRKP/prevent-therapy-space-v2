"use client";

import Image from "next/image";
import { Plus, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { partners } from "@/data/partners";

function Portrait({ partner, name, interactive }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] max-sm:aspect-[4/3]">
      <Image
        src={partner.image}
        alt={name}
        fill
        sizes="(max-width: 575px) 100vw, (max-width: 1199px) 50vw, 22vw"
        className={
          "object-cover object-top" +
          (interactive ? " transition-transform duration-700 group-hover:scale-[1.025]" : "")
        }
      />
    </div>
  );
}

function Caption({ name, role, note }) {
  return (
    <div className="mt-5">
      <h3 className="t-h3 text-white">{name}</h3>
      <p className="t-small text-white/65 mt-1">{role}</p>
      {note && <p className="t-small text-primary-soft mt-1">{note}</p>}
    </div>
  );
}

export function PartnersSection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative section-pad bg-[#070b14] m-section-alt"
    >
      <div className="container grid lg:grid-cols-12 gap-x-12">
        <SectionHeading
          id="partners-heading"
          layout="stack"
          title={t("partners.title")}
          subtitle={t("partners.subtitle")}
          className="lg:col-span-4 lg:mb-0"
        />

        <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
          {partners.map((partner) => {
            const name = t(`partners.members.${partner.id}.name`, { defaultValue: "" });
            const role = t(`partners.members.${partner.id}.role`);
            const note = t(`partners.members.${partner.id}.note`, { defaultValue: "" });
            const credentials = t(`partners.members.${partner.id}.credentials`, {
              returnObjects: true,
              defaultValue: null,
            });
            const bio = t(`partners.members.${partner.id}.bio`, {
              returnObjects: true,
              defaultValue: null,
            });
            const hasBio = Array.isArray(bio) && bio.length > 0;

            // Χωρίς όνομα και φωτογραφία δεν εμφανίζεται «κάρτα προσώπου».
            if (!name || !partner.image) return null;

            if (!hasBio) {
              return (
                <li key={partner.id}>
                  <Portrait partner={partner} name={name} />
                  <Caption name={name} role={role} note={note} />
                </li>
              );
            }

            return (
              <li key={partner.id}>
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="group block w-full text-left cursor-pointer">
                      <Portrait partner={partner} name={name} interactive />
                      <Caption name={name} role={role} note={note} />
                      <span className="mt-4 inline-flex items-center gap-2 t-small font-semibold text-primary-soft group-hover:text-[#a3dec4] transition-colors">
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        {t("partners.readMore")}
                      </span>
                    </button>
                  </DialogTrigger>

                  <DialogContent
                    closeLabel={t("partners.close")}
                    className="w-[calc(100%-2rem)] max-w-xl max-h-[85dvh] p-0 gap-0 flex flex-col bg-[#0a0f1a] border-white/10 rounded-[20px] overflow-hidden"
                  >
                    <DialogHeader className="flex-row items-center gap-4 space-y-0 p-6 pb-5 pr-14 text-left border-b border-white/10">
                      <Image
                        src={partner.image}
                        alt=""
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover object-top shrink-0"
                      />
                      <div>
                        <DialogTitle className="t-h3 text-white">{name}</DialogTitle>
                        <DialogDescription className="t-small text-white/65 mt-1">
                          {role}
                        </DialogDescription>
                      </div>
                    </DialogHeader>

                    <div className="overflow-y-auto px-6 py-6 space-y-5">
                      {Array.isArray(credentials) && credentials.length > 0 && (
                        <ul className="space-y-2.5">
                          {credentials.map((credential) => (
                            <li
                              key={credential}
                              className="flex items-start gap-3 t-small text-white/80"
                            >
                              <GraduationCap
                                className="w-4 h-4 mt-1 text-primary-soft shrink-0"
                                aria-hidden="true"
                              />
                              {credential}
                            </li>
                          ))}
                        </ul>
                      )}

                      {bio.map((paragraph, j) => (
                        <p key={j} className="t-body text-white/75">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
