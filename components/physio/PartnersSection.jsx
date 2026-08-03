"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RevealText } from "@/components/effects/kinetic-text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { partners } from "@/data/partners";

export function PartnersSection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-[#070b14]">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[200px] -translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <RevealText>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary/70" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("partners.label")}
              </span>
              <div className="w-8 h-px bg-primary/70" />
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-5">
              {t("partners.title")}
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-base lg:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
              {t("partners.subtitle")}
            </p>
          </RevealText>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {partners.map((partner, i) => {
            const Icon = partner.icon;
            const note = t(`partners.members.${partner.id}.note`, {
              defaultValue: "",
            });
            const bio = t(`partners.members.${partner.id}.bio`, {
              returnObjects: true,
              defaultValue: null,
            });
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative bg-[#050810] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 rounded-2xl p-5 transition-all"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-5">
                  {partner.image ? (
                    <>
                      <Image
                        src={partner.image}
                        alt={t(`partners.members.${partner.id}.name`)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/70 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/[0.04] border border-dashed border-white/10 rounded-xl">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">
                  {t(`partners.members.${partner.id}.name`)}
                </h3>
                <p className="text-sm text-white/55">
                  {t(`partners.members.${partner.id}.role`)}
                </p>

                {note && (
                  <span className="inline-block mt-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {note}
                  </span>
                )}

                {Array.isArray(bio) && bio.length > 0 && (
                  <Dialog>
                    <DialogTrigger className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:underline underline-offset-4">
                      {t("partners.readMore")}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto bg-[#0a0f1a] border-white/10 rounded-2xl">
                      <DialogHeader className="flex-row items-center gap-4 space-y-0">
                        {partner.image && (
                          <Image
                            src={partner.image}
                            alt={t(`partners.members.${partner.id}.name`)}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-xl object-cover object-top shrink-0"
                          />
                        )}
                        <div>
                          <DialogTitle className="text-white leading-snug">
                            {t(`partners.members.${partner.id}.name`)}
                          </DialogTitle>
                          <DialogDescription className="text-white/55 mt-1">
                            {t(`partners.members.${partner.id}.role`)}
                          </DialogDescription>
                        </div>
                      </DialogHeader>
                      <div className="space-y-4">
                        {bio.map((paragraph, j) => (
                          <p
                            key={j}
                            className="text-sm text-white/70 leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
