"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* The bundled runtime (Three.js + Anime.js) is self-contained and loaded from
   /public as a classic script that defines window.CMSDetector. This avoids any
   bundler module-resolution of the large prebuilt asset. */

type DetectorInstance = {
  explode: () => void;
  assemble: () => void;
  play: () => void;
  pause: () => void;
  setBlueprint: (on: boolean) => void;
  setProgress: (percent: number, smooth?: boolean) => void;
  resetCamera: () => void;
  destroy: () => void;
  playing: boolean;
};

declare global {
  interface Window {
    CMSDetector?: {
      createCMSDetector: (
        el: HTMLElement,
        options?: Record<string, unknown>
      ) => DetectorInstance;
    };
  }
}

const SRC = "/cms-detector/cms-detector.iife.js";

function loadRuntime(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject();
    if (window.CMSDetector) return resolve();
    const existing = document.getElementById(
      "cms-detector-runtime"
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.id = "cms-detector-runtime";
    s.src = SRC;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.body.appendChild(s);
  });
}

export default function Detector() {
  const hostRef = useRef<HTMLDivElement>(null);
  const instRef = useRef<DetectorInstance | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blueprint, setBlueprint] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const el = hostRef.current;
    if (!el) return;

    loadRuntime()
      .then(() => {
        if (cancelled || !el || !window.CMSDetector) return;
        try {
          instRef.current = window.CMSDetector.createCMSDetector(el, {
            onProgress: (p: number) => setProgress(Math.round(p)),
            onPlayState: (p: boolean) => setPlaying(p),
            onError: () => setFailed(true),
          });
          setReady(true);
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      if (instRef.current) {
        try {
          instRef.current.destroy();
        } catch {
          /* noop */
        }
        instRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    const d = instRef.current;
    if (!d) return;
    if (d.playing) d.pause();
    else d.explode();
  }, []);

  const assemble = useCallback(() => instRef.current?.assemble(), []);
  const resetView = useCallback(() => instRef.current?.resetCamera(), []);
  const toggleBlueprint = useCallback(() => {
    const next = !blueprint;
    setBlueprint(next);
    instRef.current?.setBlueprint(next);
  }, [blueprint]);

  const onSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setProgress(v);
    instRef.current?.setProgress(v);
  }, []);

  return (
    <section className="mt-12">
      <div className="relative overflow-hidden rounded-lg border border-line bg-black/20">
        <div
          ref={hostRef}
          className="h-[380px] w-full sm:h-[440px]"
          aria-label="Interactive 3D model of the CMS particle detector"
          role="img"
        />
        {!ready && !failed && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.8rem] text-muted">
            Loading detector…
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[0.85rem] text-warn">
            3D view needs WebGL. Enable hardware acceleration and reload.
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          className="rounded bg-accent px-3.5 py-2 text-[0.8rem] font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {playing ? "Pause" : "Explode"}
        </button>
        <button
          type="button"
          onClick={assemble}
          disabled={!ready}
          className="rounded border border-line px-3.5 py-2 text-[0.8rem] font-medium text-ink transition-colors hover:border-ink/40 disabled:opacity-40"
        >
          Assemble
        </button>
        <button
          type="button"
          onClick={toggleBlueprint}
          disabled={!ready}
          aria-pressed={blueprint}
          className={`rounded border px-3.5 py-2 text-[0.8rem] font-medium transition-colors disabled:opacity-40 ${
            blueprint
              ? "border-accent text-accent"
              : "border-line text-ink hover:border-ink/40"
          }`}
        >
          Blueprint
        </button>
        <button
          type="button"
          onClick={resetView}
          disabled={!ready}
          className="rounded border border-line px-3.5 py-2 text-[0.8rem] font-medium text-ink transition-colors hover:border-ink/40 disabled:opacity-40"
        >
          Reset view
        </button>
        <div className="ml-auto flex min-w-[180px] flex-1 items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={onSlider}
            disabled={!ready}
            aria-label="Disassembly"
            className="flex-1 accent-accent disabled:opacity-40"
          />
          <output className="min-w-[42px] text-right text-[0.75rem] tabular-nums text-muted">
            {progress}%
          </output>
        </div>
      </div>
      <p className="mt-3 text-[0.8rem] text-muted">
        An exploded view of the CMS particle detector — drag to orbit. Three.js
        + Anime.js.
      </p>
    </section>
  );
}
