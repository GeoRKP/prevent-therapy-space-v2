import Image from "next/image";

// Κεφαλίδα εσωτερικής σελίδας: τίτλος + εισαγωγή αριστερά και, όπου υπάρχει,
// μία καθαρή φωτογραφία του χώρου δεξιά (μόνο desktop — στο κινητό η σελίδα
// ξεκινά κατευθείαν από το περιεχόμενο). Το `label` δεν εμφανίζεται πια·
// μένει στο API ώστε να μη χρειάζεται αλλαγή σε κάθε σελίδα.
export function PageHero({ label, title, subtitle, backgroundImage }) {
  return (
    <section className="relative bg-[#050810] pt-32 pb-10 lg:pt-44 lg:pb-16">
      <div className="container grid lg:grid-cols-12 gap-x-12 gap-y-10 lg:items-end">
        <div className={backgroundImage ? "lg:col-span-7" : "lg:col-span-9"}>
          <h1 className="t-h1 text-white">{title}</h1>
          {subtitle && <p className="t-lead text-white/70 mt-6 max-w-[38rem]">{subtitle}</p>}
        </div>
        {backgroundImage && (
          <div className="lg:col-span-4 lg:col-start-9 max-lg:hidden relative aspect-[4/3] rounded-[20px] overflow-hidden">
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="33vw"
            />
          </div>
        )}
      </div>
    </section>
  );
}
