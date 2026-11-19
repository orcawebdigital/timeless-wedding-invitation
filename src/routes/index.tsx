import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { weddingData } from "@/config/weddingData";
import { ClosingMessage, InvitationFooter } from "@/components/wedding/Closing";
import { FloatingControls } from "@/components/wedding/FloatingControls";
import { InvitationHero } from "@/components/wedding/InvitationHero";
import { OpeningSequence } from "@/components/wedding/OpeningSequence";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { ScratchReveal } from "@/components/wedding/ScratchReveal";
import {
  Accommodation,
  CoupleGallery,
  Countdown,
  DressCode,
  GiftsSection,
  PreWeddingEvents,
  ProgramTimeline,
  Transportation,
  VenueSection,
  WeddingMessage,
} from "@/components/wedding/Sections";
import { PetalField, VineBorders } from "@/components/wedding/VineBorders";

const title = `${weddingData.couple.groom} & ${weddingData.couple.bride} — Wedding Invitation`;
const description = `You're invited to celebrate the wedding of ${weddingData.couple.groom} & ${weddingData.couple.bride} on ${weddingData.dateLabel} at ${weddingData.venue.name}.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.55;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) play();
    else {
      a.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onErr = () => {
      setAudioAvailable(false);
      setPlaying(false);
    };
    a.addEventListener("error", onErr);
    return () => a.removeEventListener("error", onErr);
  }, []);

  const handleDone = useCallback(() => setRevealed(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <audio ref={audioRef} src={weddingData.musicSrc} loop preload="none" />
      <OpeningSequence onOpen={play} onDone={handleDone} />

      <main
        className="paper relative mx-auto w-full max-w-[480px] overflow-hidden shadow-2xl"
        style={{ backgroundImage: `url(${weddingData.images.parchment})` }}
      >
        <InvitationHero revealed={revealed} />

        <div className="relative">
          <VineBorders />
          <div className="relative z-10">
            <WeddingMessage />
            <ScratchReveal />
            <CoupleGallery />
            <Countdown />
            <ProgramTimeline />
            <VenueSection />
            <DressCode />
            <PreWeddingEvents />
            <Transportation />
            <Accommodation />
            <GiftsSection />
            <RSVPForm />
            <ClosingMessage />
          </div>
        </div>
        <InvitationFooter />
      </main>

      {revealed && <PetalField />}
      <FloatingControls
        playing={playing}
        audioAvailable={audioAvailable}
        onToggleMusic={toggleMusic}
        showNav={revealed}
      />
    </MotionConfig>
  );
}
