"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Plus, Search, ArrowRight } from "lucide-react";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";

// Αναζήτηση χωρίς τόνους/πεζά-κεφαλαία: «συνεδρια» βρίσκει «συνεδρία».
const normalize = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("el");

export default function FaqPage() {
  const { t, ready } = useTranslation(["faq", "common"]);
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const items = ready ? t("faq:items", { returnObjects: true }) || [] : [];
  const q = normalize(query.trim());
  const filtered = items
    .map((item, index) => ({ ...item, index }))
    .filter((it) => !q || normalize(it.q).includes(q) || normalize(it.a).includes(q));

  return (
    <>
      <HeadManager namespace="faq" pageKey="meta" />

      <PageHero
        title={ready ? t("faq:title") : ""}
        subtitle={ready ? t("faq:subtitle") : ""}
      />

      <section className="relative section-pad pt-0 lg:pt-0 bg-[#050810]">
        <div className="container grid lg:grid-cols-12 gap-x-12 gap-y-10 items-start">
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-10">
            <label className="relative block">
              <span className="sr-only">{ready ? t("faq:search") : ""}</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/45" aria-hidden="true" />
              <input
                type="search"
                placeholder={ready ? t("faq:search") : ""}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenIndex(null);
                }}
                className="w-full h-13 pl-12 pr-4 rounded-xl bg-[#0a0f1a] border border-white/12 focus:border-primary-soft/60 outline-none text-white placeholder:text-white/45 transition-colors"
              />
            </label>

            <div className="max-lg:hidden pt-8 border-t border-white/12">
              <p className="t-h4 text-white">{ready ? t("faq:noAnswer") : ""}</p>
              <Link
                href="/contact"
                className="group mt-4 inline-flex items-center gap-2 font-semibold text-primary-soft hover:text-[#a3dec4] transition-colors"
              >
                {ready ? t("faq:contact") : "Contact"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ul className="border-t border-white/12">
              {filtered.map((item) => {
                const isOpen = openIndex === item.index;
                const panelId = `faq-panel-${item.index}`;
                return (
                  <li key={item.index} className="border-b border-white/12">
                    <h2>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : item.index)}
                        className="group w-full grid grid-cols-[2.25rem_1fr_1.5rem] gap-x-3 items-start py-6 text-left"
                      >
                        <span className="t-caption tabular-nums text-white/45 pt-1.5">
                          {String(item.index + 1).padStart(2, "0")}
                        </span>
                        <span className="t-h4 text-white group-hover:text-primary-soft transition-colors">
                          {item.q}
                        </span>
                        <Plus
                          aria-hidden="true"
                          className={`h-5 w-5 mt-1 text-primary-soft transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                    </h2>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="t-body text-white/75 pb-7 pl-[3rem] pr-9 max-w-[62ch]">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            <div className="lg:hidden mt-12">
              <p className="t-h4 text-white">{ready ? t("faq:noAnswer") : ""}</p>
              <Link
                href="/contact"
                className="group mt-4 inline-flex items-center gap-2 font-semibold text-primary-soft"
              >
                {ready ? t("faq:contact") : "Contact"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
