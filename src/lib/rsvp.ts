import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const rsvpSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
    attending: z.enum(["yes", "no"], { errorMap: () => ({ message: "Please let us know if you can attend" }) }),
    guests: z.coerce.number().int().min(0).max(10),
    message: z.string().trim().max(1000, "Message is too long (1000 characters max)").optional(),
  })
  .superRefine((v, ctx) => {
    if (v.attending === "yes" && v.guests < 1) {
      ctx.addIssue({ code: "custom", path: ["guests"], message: "At least 1 guest when attending" });
    }
  });

export type RsvpInput = z.input<typeof rsvpSchema>;

/** Saves one RSVP. Throws a friendly error when it couldn't be saved. */
export async function submitRsvp(input: RsvpInput) {
  const v = rsvpSchema.parse(input);
  const { error } = await supabase.from("rsvps").insert({
    name: v.name,
    attending: v.attending === "yes",
    guests: v.attending === "yes" ? v.guests : 0,
    message: v.message ? v.message : null,
  });
  if (error) throw new Error("We couldn't save your RSVP. Please try again in a moment.");
}
