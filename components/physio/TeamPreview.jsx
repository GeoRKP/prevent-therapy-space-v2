"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { team } from "@/data/team";
import { SectionHeading } from "./SectionHeading";

export function TeamPreview() {
  const { t, ready, i18n } = useTranslation(["home", "about"]);
  if (!ready) return null;
  const lang = i18n.language === "en" ? "en" : "el";

  return (
    <section className="relative section-pad bg-[#050810]">
      <div className="container">
        <SectionHeading title={t("home:team.title")} subtitle={t("home:team.subtitle")} />

        <ul className="space-y-16">
          {team.map((member) => (
            <li key={member.id} className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-end">
              <div className="lg:col-span-5 relative aspect-[4/5] rounded-[20px] overflow-hidden">
                <Image
                  src={member.image}
                  alt={t(`about:team.members.${member.id}.name`)}
                  fill
                  sizes="(max-width: 991px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>

              <div className="lg:col-span-6 lg:col-start-7 lg:pb-4">
                <h3 className="t-h2 text-white">{t(`about:team.members.${member.id}.name`)}</h3>
                <p className="t-lead text-white/70 mt-3">
                  {t(`about:team.members.${member.id}.role`)}
                  <span className="text-white/45">
                    {" · "}
                    {t(`about:team.members.${member.id}.credentials`)}
                  </span>
                </p>
                <ul className="mt-8 border-t border-white/12">
                  {member.specialties[lang].map((s) => (
                    <li key={s} className="py-3.5 border-b border-white/12 text-white/80">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
