"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight, GraduationCap } from "lucide-react";
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

const cardBase =
  "h-full bg-[#050810] border border-white/[0.06] rounded-2xl p-5";

function PartnerCardContent({ partner, name, role, note, t, interactive }) {
  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-5">
        <Image
          src={partner.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={
            interactive
              ? "object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
              : "object-cover object-top"
          }
        />
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-sm text-white/55">{role}</p>

      {note && (
        <span className="inline-block mt-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-soft/10 text-primary-soft whitespace-nowrap">
          {note}
        </span>
      )}

      {interactive && (
        <span className="mt-4 inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-white/10 group-hover:border-primary-soft/40 px-4 py-2.5 text-sm font-semibold text-primary-soft transition-colors">
          {t("partners.readMore")}
          <Plus className="w-4 h-4" aria-hidden="true" />
        </span>
      )}
    </>
  );
}

export function PartnersSection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative py-28 lg:py-36 overflow-hidden bg-[#070b14]"
    >
      <div className="container relative z-10">
        <SectionHeading
          id="partners-heading"
          centered={false}
          label={t("partners.label")}
          title={t("partners.title")}
          subtitle={t("partners.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {partners.map((partner, i) => {
            const Icon = partner.icon;
            const name = t(`partners.members.${partner.id}.name`, {
              defaultValue: "",
            });
            const role = t(`partners.members.${partner.id}.role`);
            const note = t(`partners.members.${partner.id}.note`, {
              defaultValue: "",
            });
            const roleDesc = t(`partners.members.${partner.id}.roleDesc`, {
              defaultValue: "",
            });
            const credentials = t(
              `partners.members.${partner.id}.credentials`,
              { returnObjects: true, defaultValue: null }
            );
            const bio = t(`partners.members.${partner.id}.bio`, {
              returnObjects: true,
              defaultValue: null,
            });
            const hasBio = Array.isArray(bio) && bio.length > 0;

            // Χωρίς όνομα δεν renderάρεται ποτέ «κάρτα προσώπου» — μόνο κάρτα ρόλου.
            if (!name || !partner.image) {
              return (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div
                    className={`${cardBase} flex flex-col items-start justify-center gap-3.5`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-soft/10 flex items-center justify-center">
                      <Icon
                        className="w-5 h-5 text-primary-soft"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white">{role}</h3>
                    {roleDesc && (
                      <p className="text-sm text-white/55 leading-relaxed">
                        {roleDesc}
                      </p>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-dashed border-white/20 text-white/60">
                      {t("partners.comingSoon")}
                    </span>
                  </div>
                </motion.div>
              );
            }

            if (!hasBio) {
              return (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div className={cardBase}>
                    <PartnerCardContent
                      partner={partner}
                      name={name}
                      role={role}
                      note={note}
                      t={t}
                      interactive={false}
                    />
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className={`${cardBase} group block w-full text-left cursor-pointer transition-colors hover:bg-[#0a0f1a] hover:border-primary-soft/30`}
                    >
                      <PartnerCardContent
                        partner={partner}
                        name={name}
                        role={role}
                        note={note}
                        t={t}
                        interactive
                      />
                    </button>
                  </DialogTrigger>

                  <DialogContent
                    closeLabel={t("partners.close")}
                    className="w-[calc(100%-2rem)] max-w-xl max-h-[85vh] p-0 gap-0 flex flex-col bg-[#0a0f1a] border-white/10 rounded-2xl overflow-hidden"
                  >
                    <DialogHeader className="flex-row items-center gap-4 space-y-0 p-6 pb-4 text-left">
                      <Image
                        src={partner.image}
                        alt=""
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover object-top shrink-0"
                      />
                      <div>
                        <DialogTitle className="text-white leading-snug">
                          {name}
                        </DialogTitle>
                        <DialogDescription className="text-white/55 mt-1">
                          {role}
                        </DialogDescription>
                      </div>
                    </DialogHeader>

                    <div className="overflow-y-auto px-6 pb-6 space-y-4">
                      {Array.isArray(credentials) && credentials.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                          {credentials.map((credential) => (
                            <li
                              key={credential}
                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/75"
                            >
                              <GraduationCap
                                className="w-3.5 h-3.5 text-primary-soft shrink-0"
                                aria-hidden="true"
                              />
                              {credential}
                            </li>
                          ))}
                        </ul>
                      )}

                      {bio.map((paragraph, j) => (
                        <p
                          key={j}
                          className="text-sm text-white/70 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="p-6 pt-4 border-t border-white/[0.06]">
                      <Link
                        href="/booking"
                        className="inline-flex min-h-11 items-center gap-2 px-5 py-2.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors"
                      >
                        {t("partners.dialogCta")}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
