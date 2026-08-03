"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { team } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

export function TeamPreview() {
  const { t, ready, i18n } = useTranslation(["home", "about"]);
  if (!ready) return null;
  const lang = i18n.language === "en" ? "en" : "el";

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-[#050810]">
      <div className="container relative z-10">
        <SectionHeading
          label={t("home:team.label")}
          title={t("home:team.title")}
          subtitle={t("home:team.subtitle")}
        />

        <div
          className={
            team.length === 1
              ? "max-w-md mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto"
          }
        >
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="group relative bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 rounded-3xl p-6 lg:p-8 transition-all"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5">
                <Image
                  src={member.image}
                  alt={t(`about:team.members.${member.id}.name`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-transparent" />
              </div>

              <div className="flex items-start justify-between mb-2.5 gap-3">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                  {t(`about:team.members.${member.id}.name`)}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                  {t(`about:team.members.${member.id}.credentials`)}
                </span>
              </div>

              <p className="text-sm text-white/55 mb-4">
                {t(`about:team.members.${member.id}.role`)}
              </p>

              <div className="flex flex-wrap gap-2">
                {member.specialties[lang].map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/65"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
