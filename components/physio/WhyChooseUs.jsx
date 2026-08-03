"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Hand, Stethoscope, HeartHandshake, Award } from "lucide-react";
import { RevealText } from "@/components/effects/kinetic-text";

const featureIcons = [Hand, Stethoscope, HeartHandshake];

export function WhyChooseUs() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  const features = t("whyChooseUs.features", { returnObjects: true }) || [];

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-[#070b14]">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          <div className="lg:col-span-6">
            <RevealText>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-px bg-primary-soft/70" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  {t("whyChooseUs.label")}
                </span>
              </div>
            </RevealText>

            <RevealText delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
                <span className="text-white">{t("whyChooseUs.title")}</span>{" "}
                <span className="text-primary-soft">
                  {t("whyChooseUs.titleHighlight")}
                </span>
              </h2>
            </RevealText>

            <RevealText delay={0.2}>
              <p className="text-base lg:text-lg text-white/55 mb-10 leading-relaxed lg:max-w-md">
                {t("whyChooseUs.description")}
              </p>
            </RevealText>

            <div className="grid gap-3.5">
              {features.map((feature, index) => {
                const Icon = featureIcons[index] || Hand;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="group bg-[#050810] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary-soft/30 rounded-2xl p-5 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-primary-soft/10 group-hover:bg-primary-soft/15 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-5 h-5 text-primary-soft" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-primary-soft transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/treatments/physio-12-thoracic-stretch.jpg"
                  alt="Θεραπευτική τεχνική στο PREVENT Therapy Space"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/90 via-transparent to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 lg:-left-10"
              >
                <div className="bg-[#050810]/95 backdrop-blur-xl border border-primary-soft/30 rounded-2xl p-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-primary-soft flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary-soft-foreground" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-white">8+</span>
                      <span className="block text-xs text-white/55 uppercase tracking-wider mt-0.5">
                        {t("whyChooseUs.yearsExperience")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
