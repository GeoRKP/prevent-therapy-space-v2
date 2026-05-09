"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Search, ArrowRight } from "lucide-react";
import HeadManager from "@/components/common/HeadManager";
import { MotionWrapper } from "@/components/physio/MotionWrapper";

export default function FaqPage() {
  const { t } = useTranslation(["faq", "common"]);
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const items = t("faq:items", { returnObjects: true }) || [];
  const filtered = items.filter(
    (it) =>
      it.q.toLowerCase().includes(query.toLowerCase()) ||
      it.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <HeadManager namespace="faq" pageKey="meta" />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted">
        <div className="container max-w-3xl text-center">
          <MotionWrapper>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              {t("faq:title")}
            </h1>
            <p className="text-lg text-on-surface-variant">{t("faq:subtitle")}</p>
          </MotionWrapper>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-3xl">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder={t("faq:search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
            />
          </div>

          {/* FAQ items */}
          <div className="space-y-3">
            {filtered.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <MotionWrapper key={i} delay={i * 0.05}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full text-left bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4 p-5">
                      <h3 className="font-semibold text-foreground">{item.q}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <div className="px-5 pb-5 -mt-1">
                        <p className="text-on-surface-variant leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </button>
                </MotionWrapper>
              );
            })}
          </div>

          {/* No answer */}
          <div className="mt-12 p-8 rounded-2xl bg-muted text-center">
            <h3 className="text-lg font-bold text-foreground mb-3">{t("faq:noAnswer")}</h3>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              {t("faq:contact")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
