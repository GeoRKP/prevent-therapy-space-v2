"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { team } from "@/data/team";
import { SectionHeading } from "./SectionHeading";
import { MotionWrapper } from "./MotionWrapper";

export function TeamPreview() {
  const { t, i18n } = useTranslation(["home", "about"]);
  const lang = i18n.language === "en" ? "en" : "el";

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container">
        <SectionHeading
          label={t("home:team.label")}
          title={t("home:team.title")}
          subtitle={t("home:team.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <MotionWrapper key={member.id} delay={i * 0.15}>
              <div className="group">
                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden border border-border/40 mb-5">
                  <Image
                    src={member.image}
                    alt={t(`about:team.members.${member.id}.name`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h3 className="text-xl font-bold text-foreground">
                    {t(`about:team.members.${member.id}.name`)}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {t(`about:team.members.${member.id}.credentials`)}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-3">
                  {t(`about:team.members.${member.id}.role`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.specialties[lang].map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full bg-muted text-on-surface-variant"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
