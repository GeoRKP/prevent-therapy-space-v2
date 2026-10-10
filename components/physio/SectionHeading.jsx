import { cn } from "@/lib/utils";

// Ένα μοτίβο για όλους τους τίτλους ενοτήτων: ο τίτλος αριστερά και η εισαγωγή
// δεξιά στο desktop (split), ή στοιβαγμένα. Χωρίς κεφαλαίο «eyebrow» label —
// η ιεραρχία βγαίνει από την τυπογραφία.
export function SectionHeading({ id, title, subtitle, layout = "split", className, children }) {
  if (layout === "center") {
    return (
      <div className={cn("mb-12 lg:mb-16 text-center max-w-2xl mx-auto", className)}>
        <h2 id={id} className="t-h2 text-white">
          {title}
        </h2>
        {subtitle && <p className="t-lead text-white/65 mt-5">{subtitle}</p>}
        {children}
      </div>
    );
  }

  if (layout === "stack") {
    return (
      <div className={cn("mb-12 lg:mb-16 max-w-2xl", className)}>
        <h2 id={id} className="t-h2 text-white">
          {title}
        </h2>
        {subtitle && <p className="t-lead text-white/65 mt-5">{subtitle}</p>}
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-12 lg:mb-16 grid lg:grid-cols-12 gap-x-10 gap-y-5 lg:items-end",
        className
      )}
    >
      <h2 id={id} className="t-h2 text-white lg:col-span-6">
        {title}
      </h2>
      {(subtitle || children) && (
        <div className="lg:col-span-5 lg:col-start-8">
          {subtitle && <p className="t-lead text-white/65">{subtitle}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
