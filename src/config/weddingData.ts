/**
 * All invitation content lives here. Edit names, dates, venues and photos in this
 * one file — every section of the invitation reads from it.
 */
import doorImg from "@/assets/wedding/door.webp.asset.json";
import curtainsImg from "@/assets/wedding/curtains.webp.asset.json";
import gardenImg from "@/assets/wedding/garden_hero.webp.asset.json";
import parchmentImg from "@/assets/wedding/parchment.webp.asset.json";
import vineImg from "@/assets/wedding/vine_strip.webp.asset.json";
import roseCornerImg from "@/assets/wedding/rose_corner.webp.asset.json";
import coupleSunset from "@/assets/wedding/couple_sunset.webp.asset.json";
import weddingSetup from "@/assets/wedding/wedding_setup.webp.asset.json";
import ringsHands from "@/assets/wedding/rings_hands.webp.asset.json";
import music from "@/assets/wedding/wedding_music.mp3.asset.json";

export const weddingData = {
  couple: {
    groom: "Zayn",
    bride: "Nora",
    groomParents: ["Son of Mr. & Mrs. Malik", "B.E., M.S.", "Data Scientist"],
    brideParents: ["Daughter of Mr. & Mrs. Nasser", "MBBS, M.D.", "Pediatrician"],
  },

  /** Ceremony start, with timezone offset. Drives the countdown and calendar file. */
  weddingDateISO: "2026-12-20T10:30:00+00:00",
  weddingEndISO: "2026-12-20T14:00:00+00:00",
  dateLabel: "20 December 2026",
  dayLabel: "Sunday",
  timeLabel: "10:30 AM",

  plaqueText: "Tap to Open",
  heroTagline: "We're getting married",
  heroLine: "Together with our families, we invite you to celebrate the beginning of our forever.",

  message:
    "With the blessings of our families and the love of those closest to our hearts, we invite you to join us as we begin a beautiful new chapter together.",

  scratch: {
    title: "Scratch to Reveal",
    revealedTitle: "Our forever begins",
    hiddenHeading: "Our Wedding Day",
    invitedLabel: "You're Invited!",
  },

  photos: [
    { src: coupleSunset.url, alt: "The couple walking hand in hand at sunset" },
    { src: weddingSetup.url, alt: "Floral ceremony arch with cream roses" },
    { src: ringsHands.url, alt: "Wedding rings and a bouquet of cream roses" },
  ],

  program: [
    {
      date: "Sunday, December 20, 2026",
      events: [
        { time: "10:00 AM", title: "Guest Arrival", description: "Welcome drinks and guest reception." },
        { time: "10:30 AM", title: "Wedding Ceremony", description: "Celebrate the wedding ceremony with family and friends." },
        { time: "12:30 PM", title: "Wedding Celebration", description: "Photography and family celebrations." },
      ],
    },
    {
      date: "Tuesday, December 22, 2026",
      events: [{ time: "7:30 PM", title: "Reception", description: "An evening of celebration and memories." }],
    },
  ],

  venue: {
    name: "Grand Palace Hall",
    address: "City Centre, London",
    mapQuery: "Grand Palace Hall, London",
  },

  dressCode: {
    women: "Elegant traditional or formal attire in pastel and muted shades.",
    men: "Suit or traditional formal wear.",
  },

  preWedding: [
    { date: "Thursday, December 17, 2026", time: "5:30 PM", title: "Mehendi", description: "An afternoon of colors, music and celebration." },
    { date: "Friday, December 18, 2026", time: "8:00 PM", title: "Haldi", description: "Join us for a joyful celebration." },
  ],

  transportation: {
    text: "Shuttle service will be available from the city centre to the wedding venue.",
    pickup: "Central Station",
    time: "3:30 PM",
  },

  accommodation: {
    text: "Special rates at the Grand Palace Hotel (5 minutes from the venue).",
    details: "Mention code ZAYNNORA when booking.",
    phone: "+44 20 0000 0000",
  },

  gifts: "Your love, blessings and presence are the greatest gifts we could ever ask for.",

  rsvp: {
    intro: "Your presence would mean the world to us. Please let us know if you can join our celebration.",
    maxGuests: 10,
  },

  closing: "We can't wait to celebrate with you!",

  images: {
    door: doorImg.url,
    curtains: curtainsImg.url,
    garden: gardenImg.url,
    parchment: parchmentImg.url,
    vine: vineImg.url,
    roseCorner: roseCornerImg.url,
  },

  musicSrc: music.url,
} as const;

export type WeddingData = typeof weddingData;
