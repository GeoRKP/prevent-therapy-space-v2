"use client";

import { useState } from "react";

// Εμφάνιση λαθών φόρμας με τους κοινούς κανόνες του lib/form-validation.js.
// Το λάθος ενός πεδίου φαίνεται αφού ο χρήστης το αφήσει (blur) ή πατήσει
// υποβολή· από εκεί και πέρα ξαναελέγχεται σε κάθε πληκτρολόγηση, ώστε το
// μήνυμα να ενημερώνεται (π.χ. «λείπουν 2 ψηφία») και να σβήνει μόλις
// διορθωθεί. Λάθη που γύρισε ο server μένουν μέχρι να αλλάξει η τιμή.
export function useFormValidation(validate, values, fields) {
  const [touched, setTouched] = useState({});
  const [server, setServer] = useState({});

  // Φθηνός υπολογισμός (λίγα πεδία) — γίνεται σε κάθε render.
  const current = validate(values);
  const errors = {};
  for (const f of fields) {
    if (touched[f] && current[f]) errors[f] = current[f];
    else if (server[f] && server[f].value === values[f]) errors[f] = server[f].error;
  }

  return {
    errors,
    touch: (f) => setTouched((t) => (t[f] ? t : { ...t, [f]: true })),
    // Υποβολή: όλα τα πεδία θεωρούνται «αγγιγμένα»· επιστρέφει το πρώτο λάθος.
    touchAll: () => {
      setTouched(Object.fromEntries(fields.map((f) => [f, true])));
      return fields.find((f) => current[f]) || null;
    },
    fromServer: (fieldErrors = {}) => {
      setServer(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([f, error]) => [f, { error, value: values[f] }])
        )
      );
      return fields.find((f) => fieldErrors[f]) || null;
    },
    reset: () => {
      setTouched({});
      setServer({});
    },
  };
}

// Φέρνει το πεδίο στο κέντρο της οθόνης (όχι κάτω από το σταθερό header) και
// του δίνει focus, ώστε ο χρήστης να δει αμέσως το μήνυμα.
export function focusField(id) {
  const el = typeof document !== "undefined" ? document.getElementById(id) : null;
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.focus({ preventScroll: true });
}
