import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Users } from "lucide-react";
import { useState } from "react";
import { weddingData } from "@/config/weddingData";
import { rsvpSchema, submitRsvp } from "@/lib/rsvp";
import { Reveal, Section, SectionHeading } from "./Ornaments";

type Errors = Partial<Record<"name" | "attending" | "guests" | "message", string>>;

export function RSVPForm() {
  const [form, setForm] = useState({ name: "", attending: "", guests: "1", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [sentAttending, setSentAttending] = useState(true);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const parsed = rsvpSchema.safeParse({
      ...form,
      guests: form.attending === "no" ? 0 : form.guests,
    });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    setServerError("");
    try {
      await submitRsvp(parsed.data);
      setSentAttending(parsed.data.attending === "yes");
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const label = "mb-1.5 flex items-center gap-1.5 font-serif text-[0.95rem] font-semibold text-ink";
  const errorText = "mt-1 font-serif text-sm text-destructive";

  return (
    <Section id="rsvp">
      <SectionHeading icon={<Mail className="h-7 w-7" strokeWidth={1.3} />} title="RSVP" />
      <Reveal>
        <p className="mb-8 text-center font-serif text-[1.05rem] leading-relaxed text-ink/85">{weddingData.rsvp.intro}</p>
      </Reveal>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-md border border-sage/30 bg-ivory/70 p-6 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto h-10 w-10 text-sage" strokeWidth={1.4} />
            <p className="mt-3 font-script text-3xl text-forest">Thank you, {form.name.trim().split(" ")[0]}!</p>
            <p className="mt-2 font-serif text-ink/80">
              {sentAttending
                ? "Your RSVP has been received. We can't wait to celebrate with you."
                : "Your reply has been received. You'll be missed — thank you for letting us know."}
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
            <div>
              <label htmlFor="rsvp-name" className={label}>
                Your Name <span className="text-destructive">*</span>
              </label>
              <input
                id="rsvp-name"
                className="field-vintage"
                placeholder="Your full name"
                value={form.name}
                onChange={set("name")}
                maxLength={100}
                autoComplete="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className={errorText}>{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="rsvp-attending" className={label}>
                <Users className="h-4 w-4" /> Will you be attending? <span className="text-destructive">*</span>
              </label>
              <select
                id="rsvp-attending"
                className="field-vintage appearance-none bg-[length:12px] bg-[right_0.9rem_center] bg-no-repeat"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23514A39' stroke-width='1.5'/%3E%3C/svg%3E\")",
                }}
                value={form.attending}
                onChange={set("attending")}
                aria-invalid={!!errors.attending}
              >
                <option value="">Select...</option>
                <option value="yes">Joyfully Accept</option>
                <option value="no">Regretfully Decline</option>
              </select>
              {errors.attending && <p className={errorText}>{errors.attending}</p>}
            </div>

            {form.attending !== "no" && (
              <div>
                <label htmlFor="rsvp-guests" className={label}>
                  Number of Guests
                </label>
                <input
                  id="rsvp-guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={weddingData.rsvp.maxGuests}
                  className="field-vintage"
                  value={form.guests}
                  onChange={set("guests")}
                  aria-invalid={!!errors.guests}
                />
                {errors.guests && <p className={errorText}>{errors.guests}</p>}
              </div>
            )}

            <div>
              <label htmlFor="rsvp-message" className={label}>
                Your Message
              </label>
              <textarea
                id="rsvp-message"
                rows={4}
                className="field-vintage resize-none"
                placeholder="Write your wishes..."
                value={form.message}
                onChange={set("message")}
                maxLength={1000}
              />
              {errors.message && <p className={errorText}>{errors.message}</p>}
            </div>

            {status === "error" && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-center font-serif text-destructive" role="alert">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-forest py-3.5 font-serif text-base text-ivory shadow-[var(--shadow-soft)] transition active:scale-[0.98] disabled:opacity-70"
            >
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </Section>
  );
}
