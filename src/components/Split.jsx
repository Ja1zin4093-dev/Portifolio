import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

/**
 * Improvements made:
 * - Timeline is created paused so it won't start while the loading overlay is visible.
 * - Initial "from" state is applied immediately via gsap.set(...) so the text stays hidden until the animation runs.
 * - The component listens for a custom window event "app:loadingFinished" (dispatched by ParticleBackground)
 *   and will start the animation when that event arrives (only if the animation hasn't already completed).
 * - This ensures the "text appearing" animation only starts after the loading overlay is gone.
 */

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const scrollTriggerRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;

    const el = ref.current;
    animationCompletedRef.current = false;

    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";

    let splitter;
    try {
      splitter = new GSAPSplitText(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line",
      });
    } catch (error) {
      console.error("Failed to create SplitText:", error);
      return;
    }

    let targets;
    switch (splitType) {
      case "lines":
        targets = splitter.lines;
        break;
      case "words":
        targets = splitter.words;
        break;
      case "chars":
        targets = splitter.chars;
        break;
      default:
        targets = splitter.chars;
    }

    if (!targets || targets.length === 0) {
      console.warn("No targets found for SplitText animation");
      splitter.revert();
      return;
    }

    targets.forEach((t) => {
      t.style.willChange = "transform, opacity";
    });

    // Calculate ScrollTrigger start string
    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? (marginMatch[2] || "px") : "px";
    const sign = marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    // Ensure initial "from" state is applied immediately so the text stays hidden while the loading overlay is visible.
    gsap.set(targets, { ...from, immediateRender: true, force3D: true });

    // Create timeline paused so it won't run before we remove the loading overlay.
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
        onToggle: (self) => {
          scrollTriggerRef.current = self;
        },
      },
      smoothChildTiming: true,
      onComplete: () => {
        animationCompletedRef.current = true;
        // Apply final props and clear willChange
        gsap.set(targets, {
          ...to,
          clearProps: "willChange",
          immediateRender: true,
        });
        onLetterAnimationComplete?.();
      },
    });

    // Build timeline animation
    tl.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
    });

    tlRef.current = tl;

    // Handler to start animation after loading finishes.
    function handleLoadingFinished() {
      // If animation already completed, do nothing.
      if (animationCompletedRef.current) return;

      // Prefer to let ScrollTrigger start it when element is in view.
      // Refresh ScrollTrigger positions first so it recalculates layout.
      try {
        ScrollTrigger.refresh(true);
      } catch (e) {
        console.error("Error refreshing ScrollTrigger:", e);
      }

      // If the timeline hasn't played yet, start it.
      // This ensures the animation will run if it was blocked by the loading overlay.
      if (tlRef.current && !animationCompletedRef.current) {
        try {
          tlRef.current.play();
        } catch (e) {
          console.error("Error playing timeline:", e);
          gsap.to(targets, {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            force3D: true,
          });
        }
      }
    }

    // Listen for custom event (dispatched by ParticleBackground when loading finishes)
    window.addEventListener("app:loadingFinished", handleLoadingFinished);

    // Also try to start automatically if the trigger is already in view and loading is already finished on mount.
    // (If your app sets a global flag instead of using the event, you could check it here.)
    // No-op otherwise.

    return () => {
      // cleanup
      window.removeEventListener("app:loadingFinished", handleLoadingFinished);
      if (tlRef.current) {
        try {
          tlRef.current.kill();
        } catch (e) {console.error(e)}
        tlRef.current = null;
      }
      if (scrollTriggerRef.current) {
        try {
          scrollTriggerRef.current.kill();
        } catch (e) {console.error(e)}
        scrollTriggerRef.current = null;
      }
      gsap.killTweensOf(targets);
      if (splitter) {
        try {
          splitter.revert();
        } catch (e) {console.error(e)}
      }
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;