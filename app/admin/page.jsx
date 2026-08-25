"use client";

// Πίνακας διαχείρισης θεραπευτή: ραντεβού (ακύρωση/μετάθεση), ωράριο &
// ρυθμίσεις κρατήσεων, κλειστές ημέρες. Ελληνικά μόνο — εσωτερικό εργαλείο.

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarX,
  Clock,
  Lock,
  LogOut,
  Phone,
  Mail,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DAY_NAMES = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const inputCls =
  "px-3 py-2 rounded-xl bg-[#050810] border border-white/[0.08] focus:border-primary-soft/50 outline-none transition-all text-sm text-white [color-scheme:dark]";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors disabled:opacity-40";
const btnGhost =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-xs transition-colors";

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null=loading

  useEffect(() => {
    document.title = "Διαχείριση | PREVENT";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authorized)))
      .catch(() => setAuthed(false));
  }, []);

  return (
    <section className="relative min-h-screen py-28 lg:py-32 bg-[#050810]">
      <div className="container relative z-10 max-w-4xl">
        {authed === null && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-primary-soft/30 border-t-primary-soft animate-spin" />
          </div>
        )}
        {authed === false && <Login onSuccess={() => setAuthed(true)} />}
        {authed === true && <Dashboard onLogout={() => setAuthed(false)} />}
      </div>
    </section>
  );
}

function Login({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) onSuccess();
      else toast.error("Λάθος κωδικός.");
    } catch {
      toast.error("Κάτι πήγε στραβά. Δοκιμάστε ξανά.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-sm mx-auto bg-[#070b14] border border-white/[0.06] rounded-3xl p-8 text-center"
    >
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary-soft/10 flex items-center justify-center">
        <Lock className="w-7 h-7 text-primary-soft" />
      </div>
      <h1 className="text-xl font-bold text-white mb-1 tracking-tight">Διαχείριση</h1>
      <p className="text-white/55 text-sm mb-6">PREVENT Therapy Space</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Κωδικός πρόσβασης"
        autoFocus
        className={cn(inputCls, "w-full mb-4 placeholder:text-white/30")}
      />
      <button type="submit" disabled={busy || !password} className={cn(btnPrimary, "w-full")}>
        Είσοδος
      </button>
    </form>
  );
}

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("appointments");

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    onLogout();
  };

  const tabs = [
    { key: "appointments", label: "Ραντεβού", icon: CalendarDays },
    { key: "settings", label: "Ωράριο & Ρυθμίσεις", icon: Settings },
    { key: "closures", label: "Κλειστές ημέρες", icon: CalendarX },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          Διαχείριση
        </h1>
        <button onClick={logout} className={btnGhost}>
          <LogOut className="w-3.5 h-3.5" />
          Έξοδος
        </button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors",
              tab === key
                ? "bg-primary-soft text-primary-soft-foreground"
                : "border border-white/10 text-white/60 hover:text-white hover:border-white/25"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "appointments" && <AppointmentsTab />}
      {tab === "settings" && <SettingsTab />}
      {tab === "closures" && <ClosuresTab />}
    </div>
  );
}

/* ------------------------------ Ραντεβού ------------------------------ */

function AppointmentsTab() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const load = async () => {
    setData(null);
    setError(false);
    try {
      const res = await fetch("/api/admin/appointments", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    if (!data) return [];
    const byDay = new Map();
    for (const a of data.appointments) {
      const day = new Intl.DateTimeFormat("en-CA", {
        timeZone: data.timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(a.start));
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day).push(a);
    }
    return [...byDay.entries()];
  }, [data]);

  if (error) return <LoadError onRetry={load} />;
  if (!data) return <Spinner />;

  if (data.appointments.length === 0) {
    return (
      <Card>
        <p className="text-white/55 text-sm text-center py-6">
          Δεν υπάρχουν επερχόμενα ραντεβού μέσω του site.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([day, list]) => (
        <div key={day}>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 capitalize">
            {new Date(`${day}T12:00:00`).toLocaleDateString("el-GR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <div className="space-y-3">
            {list.map((a) => (
              <AppointmentRow key={a.id} appt={a} timeZone={data.timeZone} onChanged={load} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentRow({ appt, timeZone, onChanged }) {
  const [mode, setMode] = useState("view"); // view | confirmCancel | reschedule
  const [busy, setBusy] = useState(false);

  const time = new Intl.DateTimeFormat("el-GR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(appt.start));

  const cancel = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appt.id }),
      });
      if (res.ok) {
        toast.success("Το ραντεβού ακυρώθηκε και ο ασθενής ενημερώθηκε.");
        onChanged();
      } else {
        toast.error("Η ακύρωση απέτυχε.");
        setBusy(false);
      }
    } catch {
      toast.error("Η ακύρωση απέτυχε.");
      setBusy(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="font-mono font-bold text-primary-soft text-lg w-14">{time}</span>
        <div className="flex-1 min-w-[180px]">
          <p className="text-white font-semibold text-sm">{appt.name}</p>
          <p className="text-white/50 text-xs flex items-center gap-3 mt-1 flex-wrap">
            {appt.phone && (
              <a href={`tel:${appt.phone}`} className="inline-flex items-center gap-1 hover:text-primary-soft">
                <Phone className="w-3 h-3" />
                {appt.phone}
              </a>
            )}
            {appt.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {appt.email}
              </span>
            )}
          </p>
        </div>
        {mode === "view" && (
          <div className="flex gap-2">
            <button onClick={() => setMode("reschedule")} className={btnGhost}>
              <Clock className="w-3.5 h-3.5" />
              Αλλαγή ώρας
            </button>
            <button onClick={() => setMode("confirmCancel")} className={btnGhost}>
              <CalendarX className="w-3.5 h-3.5" />
              Ακύρωση
            </button>
          </div>
        )}
        {mode === "confirmCancel" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/55">Σίγουρα; Ο ασθενής θα ενημερωθεί.</span>
            <button onClick={cancel} disabled={busy} className={cn(btnPrimary, "px-4 py-2 text-xs")}>
              Ναι, ακύρωση
            </button>
            <button onClick={() => setMode("view")} className={btnGhost}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      {mode === "reschedule" && (
        <ReschedulePicker
          apptId={appt.id}
          onDone={() => {
            setMode("view");
            onChanged();
          }}
          onClose={() => setMode("view")}
        />
      )}
    </Card>
  );
}

function ReschedulePicker({ apptId, onDone, onClose }) {
  const [availability, setAvailability] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/booking/availability", { cache: "no-store" })
      .then((r) => r.json())
      .then(setAvailability)
      .catch(() => toast.error("Αποτυχία φόρτωσης διαθεσιμότητας."));
  }, []);

  const day = availability?.days.find((d) => d.date === date);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/appointments/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: apptId, date, time }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Το ραντεβού μεταφέρθηκε και ο ασθενής ενημερώθηκε.");
        onDone();
      } else if (data.error === "slot_taken") {
        toast.error("Η ώρα μόλις κρατήθηκε — επιλέξτε άλλη.");
        setBusy(false);
      } else {
        toast.error("Η μετάθεση απέτυχε.");
        setBusy(false);
      }
    } catch {
      toast.error("Η μετάθεση απέτυχε.");
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-end gap-3 flex-wrap">
      <label className="text-xs text-white/55">
        Νέα ημέρα
        <select
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
          className={cn(inputCls, "block mt-1 min-w-[180px]")}
        >
          <option value="">— επιλέξτε —</option>
          {(availability?.days || []).map((d) => (
            <option key={d.date} value={d.date}>
              {new Date(`${d.date}T12:00:00`).toLocaleDateString("el-GR", {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-white/55">
        Νέα ώρα
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={!day}
          className={cn(inputCls, "block mt-1 min-w-[110px]")}
        >
          <option value="">—</option>
          {(day?.slots || []).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button onClick={submit} disabled={!date || !time || busy} className={cn(btnPrimary, "px-4 py-2 text-xs")}>
        Μετάθεση
      </button>
      <button onClick={onClose} className={btnGhost}>
        Άκυρο
      </button>
    </div>
  );
}

/* --------------------------- Ωράριο & Ρυθμίσεις --------------------------- */

function SettingsTab() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setForm(null);
    setError(false);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setForm(await res.json());
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <LoadError onRetry={load} />;
  if (!form) return <Spinner />;

  const setNum = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: Number(e.target.value) }));

  const setDay = (day, ranges) =>
    setForm((f) => ({ ...f, workingHours: { ...f.workingHours, [day]: ranges } }));

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Οι ρυθμίσεις αποθηκεύτηκαν.");
      else toast.error("Ελέγξτε τις τιμές — η αποθήκευση απέτυχε.");
    } catch {
      toast.error("Η αποθήκευση απέτυχε.");
    } finally {
      setBusy(false);
    }
  };

  const numbers = [
    ["durationMinutes", "Διάρκεια ραντεβού (λεπτά)"],
    ["minNoticeHours", "Ελάχιστη προειδοποίηση κράτησης (ώρες)"],
    ["cancelNoticeHours", "Όριο online ακύρωσης (ώρες πριν)"],
    ["maxAdvanceDays", "Παράθυρο κρατήσεων (ημέρες, έως 30)"],
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-sm font-bold text-white mb-4">Ρυθμίσεις</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {numbers.map(([key, label]) => (
            <label key={key} className="text-xs text-white/55">
              {label}
              <input
                type="number"
                value={form[key]}
                onChange={setNum(key)}
                className={cn(inputCls, "block mt-1 w-full")}
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-bold text-white mb-1">Ωράριο</h2>
        <p className="text-xs text-white/40 mb-4">
          Δύο διαστήματα ανά ημέρα υποστηρίζουν μεσημεριανό διάλειμμα.
        </p>
        <div className="space-y-3">
          {DAY_ORDER.map((day) => (
            <DayRow
              key={day}
              name={DAY_NAMES[day]}
              ranges={form.workingHours[day]}
              onChange={(ranges) => setDay(day, ranges)}
            />
          ))}
        </div>
      </Card>

      <button onClick={save} disabled={busy} className={btnPrimary}>
        Αποθήκευση ρυθμίσεων
      </button>
    </div>
  );
}

function DayRow({ name, ranges, onChange }) {
  const open = Array.isArray(ranges) && ranges.length > 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="inline-flex items-center gap-2 w-28 text-sm text-white cursor-pointer">
        <input
          type="checkbox"
          checked={open}
          onChange={(e) =>
            onChange(e.target.checked ? [{ from: "09:00", to: "21:00" }] : null)
          }
          className="accent-[#82d9b9]"
        />
        {name}
      </label>
      {open ? (
        <div className="flex items-center gap-2 flex-wrap">
          {ranges.map((r, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <input
                type="time"
                value={r.from}
                onChange={(e) =>
                  onChange(ranges.map((x, j) => (j === i ? { ...x, from: e.target.value } : x)))
                }
                className={inputCls}
              />
              <span className="text-white/40 text-xs">—</span>
              <input
                type="time"
                value={r.to}
                onChange={(e) =>
                  onChange(ranges.map((x, j) => (j === i ? { ...x, to: e.target.value } : x)))
                }
                className={inputCls}
              />
              {ranges.length > 1 && (
                <button
                  onClick={() => onChange(ranges.filter((_, j) => j !== i))}
                  className="text-white/40 hover:text-white p-1"
                  aria-label="Αφαίρεση διαστήματος"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          ))}
          {ranges.length < 2 && (
            <button
              onClick={() =>
                onChange([...ranges, { from: "17:00", to: "21:00" }])
              }
              className={btnGhost}
            >
              <Plus className="w-3 h-3" />
              Διάλειμμα
            </button>
          )}
        </div>
      ) : (
        <span className="text-white/30 text-xs">Κλειστά</span>
      )}
    </div>
  );
}

/* ----------------------------- Κλειστές ημέρες ----------------------------- */

function ClosuresTab() {
  const [closures, setClosures] = useState(null);
  const [error, setError] = useState(false);
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setClosures(null);
    setError(false);
    try {
      const res = await fetch("/api/admin/closures", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setClosures((await res.json()).closures);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/closures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (res.ok) {
        toast.success("Η ημέρα έκλεισε — δεν δέχεται πλέον κρατήσεις.");
        setDate("");
        load();
      } else toast.error("Αποτυχία.");
    } catch {
      toast.error("Αποτυχία.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`/api/admin/closures?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Η ημέρα άνοιξε ξανά.");
        load();
      } else toast.error("Αποτυχία.");
    } catch {
      toast.error("Αποτυχία.");
    }
  };

  if (error) return <LoadError onRetry={load} />;
  if (!closures) return <Spinner />;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-sm font-bold text-white mb-1">Κλείσιμο ημέρας</h2>
        <p className="text-xs text-white/40 mb-4">
          Άδεια, αργία ή έκτακτο κλείσιμο: η ημέρα παύει να δέχεται online κρατήσεις.
          Υπάρχοντα ραντεβού της ημέρας δεν ακυρώνονται αυτόματα.
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
          <button onClick={add} disabled={!date || busy} className={cn(btnPrimary, "px-4 py-2 text-xs")}>
            <CalendarX className="w-3.5 h-3.5" />
            Κλείσιμο
          </button>
        </div>
      </Card>

      {closures.length > 0 && (
        <Card>
          <h2 className="text-sm font-bold text-white mb-4">Προγραμματισμένες κλειστές ημέρες</h2>
          <div className="space-y-2">
            {closures.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-white capitalize">
                  {c.date
                    ? new Date(`${c.date}T12:00:00`).toLocaleDateString("el-GR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
                <button
                  onClick={() => remove(c.id)}
                  className="text-white/40 hover:text-white p-1.5"
                  aria-label="Άνοιγμα ημέρας"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------- Κοινά UI ------------------------------- */

function Card({ children }) {
  return (
    <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-6">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 rounded-full border-2 border-primary-soft/30 border-t-primary-soft animate-spin" />
    </div>
  );
}

function LoadError({ onRetry }) {
  return (
    <Card>
      <div className="text-center py-6">
        <p className="text-white/55 text-sm mb-4">Αποτυχία φόρτωσης.</p>
        <button onClick={onRetry} className={btnGhost}>
          <RefreshCw className="w-3.5 h-3.5" />
          Δοκιμή ξανά
        </button>
      </div>
    </Card>
  );
}
