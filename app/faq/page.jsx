"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDown, Search, ArrowUpRight } from "lucide-react";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";

export default function FaqPage() {
  const { t, ready } = useTranslation(["faq", "common"]);
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const items = ready ? t("faq:items", { returnObjects: true }) || [] : [];
  const filtered = items.filter(
    (it) =>
      it.q.toLowerCase().includes(query.toLowerCase()) ||
      it.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <HeadManager namespace="faq" pageKey="meta" />

      <PageHero
        label={ready ? "FAQ" : ""}
        title={ready ? t("faq:title") : ""}
        subtitle={ready ? t("faq:subtitle") : ""}
      />

      <section className="relative py-24 lg:py-32 overflow-hidden bg-surface-0">
        <div className="container relative z-10 max-w-3xl">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-8"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              placeholder={ready ? t("faq:search") : ""}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-surface-1 border border-white/[0.06] focus:border-primary/50 outline-none text-base text-white placeholder:text-white/30 transition-all"
            />
          </motion.div>

          <div className="space-y-3">
            {filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="group w-full text-left bg-surface-1 hover:bg-surface-2 border border-white/[0.06] hover:border-primary/30 rounded-2xl transition-all overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 p-5 lg:p-7">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-xs font-mono text-white/30 group-hover:text-primary transition-colors mt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                        {item.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-primary flex-shrink-0 mt-0.5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 lg:px-7 lg:pb-7 pl-14 lg:pl-16">
                        <p className="text-white/55 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-8 rounded-3xl bg-surface-1 border border-white/[0.06] text-center"
          >
            <h3 className="text-xl font-bold text-white mb-3">
              {ready ? t("faq:noAnswer") : ""}
            </h3>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 mt-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {ready ? t("faq:contact") : "Contact"}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
