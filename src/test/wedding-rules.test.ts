import { describe, expect, it } from "vitest";
import { buildICS, getTimeLeft } from "@/lib/calendar";
import { rsvpSchema } from "@/lib/rsvp";
import { weddingData } from "@/config/weddingData";

describe("countdown", () => {
  it("targets 20 December 2026", () => {
    const d = new Date(weddingData.weddingDateISO);
    expect(d.getUTCFullYear()).toBe(2026);
    expect(d.getUTCMonth()).toBe(11);
    expect(d.getUTCDate()).toBe(20);
  });

  it("splits remaining time into days, hours, minutes and seconds", () => {
    const target = Date.UTC(2026, 11, 20, 10, 30);
    const now = target - (2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000);
    expect(getTimeLeft(target, now)).toEqual({ done: false, days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it("reports the wedding day once the countdown reaches zero", () => {
    const target = Date.UTC(2026, 11, 20, 10, 30);
    expect(getTimeLeft(target, target + 1000).done).toBe(true);
  });
});

describe("save the date calendar file", () => {
  it("starts at the ceremony time", () => {
    const ics = buildICS({
      title: "Zayn & Nora Wedding",
      startISO: "2026-12-20T10:30:00+00:00",
      endISO: "2026-12-20T14:00:00+00:00",
      location: "Grand Palace Hall, London",
      description: "x",
    });
    expect(ics).toContain("DTSTART:20261220T103000Z");
    expect(ics).toContain("LOCATION:Grand Palace Hall\\, London");
  });
});

describe("RSVP rules", () => {
  it("requires a name", () => {
    expect(rsvpSchema.safeParse({ name: "  ", attending: "yes", guests: 1 }).success).toBe(false);
  });
  it("requires an attendance answer", () => {
    expect(rsvpSchema.safeParse({ name: "Ann", attending: "", guests: 1 }).success).toBe(false);
  });
  it("needs at least one guest when accepting", () => {
    expect(rsvpSchema.safeParse({ name: "Ann", attending: "yes", guests: 0 }).success).toBe(false);
  });
  it("allows at most 10 guests", () => {
    expect(rsvpSchema.safeParse({ name: "Ann", attending: "yes", guests: 11 }).success).toBe(false);
    expect(rsvpSchema.safeParse({ name: "Ann", attending: "yes", guests: 10 }).success).toBe(true);
  });
  it("accepts a decline with zero guests", () => {
    expect(rsvpSchema.safeParse({ name: "Ann", attending: "no", guests: 0 }).success).toBe(true);
  });
});
