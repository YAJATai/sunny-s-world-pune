/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FULL_TEXT = 'Velar.';
const HOUSE_IMG = 'https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780471903/building_bzziky.png';
const BG_IMG = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260603_073200_7082add5-f1f8-4873-8696-d6f78a44089b.png&w=1920&q=85';

const GALLERY_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154759_4cdc8175-8261-497c-b688-9477c76545d4.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154751_39b1b9bb-2708-4211-b6a2-d39f93309e52.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260528_154737_eba7900c-0313-483c-a30a-632c747ccc42.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_144009_4348fe33-f885-4345-8e92-3fe1c2625d32.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_145337_e44eaa8c-6bb1-4a6e-a70f-ed0231cbaccb.mp4'
];

interface CountUpProps {
  end: number;
  suffix?: string;
}

function CountUp({ end, suffix = '' }: CountUpProps) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          
          let startTime: number | null = null;
          const duration = 2000;
          
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing cubic out
            const eased = 1 - Math.pow(1 - progress, 3);
            
            setValue(Math.round(eased * end));
            
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          
          requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [end]);

  return (
    <div ref={elementRef} className="tabular-nums">
      {value}
      {suffix}
    </div>
  );
}

export default function App() {
  // Preloader / Overlay States
  const [typedLength, setTypedLength] = useState(0);
  const [hideCursor, setHideCursor] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [showHeroText, setShowHeroText] = useState(false);
  const [liftDone, setLiftDone] = useState(false);

  // Navigation and Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navOnDark, setNavOnDark] = useState(false);

  // References
  const heroRef = useRef<HTMLElement>(null);
  const section5Ref = useRef<HTMLElement>(null);
  const section6Ref = useRef<HTMLElement>(null);
  const houseImgRef = useRef<HTMLImageElement>(null);

  // Scroll House Animation State
  const [imgLoaded, setImgLoaded] = useState(false);
  const [houseTransform, setHouseTransform] = useState({
    progress: 0,
    currentX: 0,
    currentY: 0,
    currentScale: 1,
    baseW: 1400,
  });

  // Preloader Setup
  useEffect(() => {
    // Typewriter effect
    const typeTimers: number[] = [];
    for (let i = 0; i <= FULL_TEXT.length; i++) {
      const timer = window.setTimeout(() => {
        setTypedLength(i);
      }, 600 + i * 140);
      typeTimers.push(timer);
    }

    const LIFT_AT = 600 + 6 * 140 + 700; // 2140ms

    // Hide cursor at LIFT_AT - 150ms
    const cursorTimer = window.setTimeout(() => {
      setHideCursor(true);
    }, LIFT_AT - 150);

    // Start lifting overlay at LIFT_AT
    const liftTimer = window.setTimeout(() => {
      setLifting(true);
    }, LIFT_AT);

    // Fade in hero text at LIFT_AT + 1300ms
    const heroTextTimer = window.setTimeout(() => {
      setShowHeroText(true);
    }, LIFT_AT + 1300);

    // Set liftDone true at LIFT_AT + 2100ms
    const liftDoneTimer = window.setTimeout(() => {
      setLiftDone(true);
    }, LIFT_AT + 2100);

    return () => {
      typeTimers.forEach((t) => clearTimeout(t));
      clearTimeout(cursorTimer);
      clearTimeout(liftTimer);
      clearTimeout(heroTextTimer);
      clearTimeout(liftDoneTimer);
    };
  }, []);

  // Update house position and scale on scroll/resize after liftDone is true
  useEffect(() => {
    if (!liftDone) return;

    const handleScrollAndResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const heroElement = heroRef.current;
      const darkElement = section5Ref.current;
      const imgElement = houseImgRef.current;

      if (heroElement && darkElement && imgElement) {
        const heroRect = heroElement.getBoundingClientRect();
        const darkRect = darkElement.getBoundingClientRect();

        const heroH = heroElement.offsetHeight;
        const imgH = imgElement.offsetHeight;

        const baseW = Math.max(vw, 1400);
        const triggerPoint = -(heroH * 0.30);
        const endPoint = heroRect.top - (darkRect.bottom - vh);

        let progress = 0;
        if (endPoint !== triggerPoint) {
          progress = (heroRect.top - triggerPoint) / (endPoint - triggerPoint);
        }
        progress = Math.min(Math.max(progress, 0), 1);

        // smoothstep applied twice
        const smoothstep = (x: number) => x * x * (3 - 2 * x);
        const t = smoothstep(smoothstep(progress));

        const startX = (vw - baseW) / 2;
        const startY = vh - imgH;

        const finalScale = 1.45;
        const finalX = (vw - baseW * finalScale) / 2;
        const mobileOffset = vw < 1024 ? -250 : 4;
        const finalY = darkRect.bottom - imgH * finalScale + 500 + mobileOffset;

        const currentX = startX + (finalX - startX) * t;
        const currentY = startY + (finalY - startY) * t;
        const currentScale = 1 + (finalScale - 1) * t;

        setHouseTransform({
          progress,
          currentX,
          currentY,
          currentScale,
          baseW,
        });
      }
    };

    window.addEventListener('scroll', handleScrollAndResize, { passive: true });
    window.addEventListener('resize', handleScrollAndResize, { passive: true });

    // Call immediately to catch correct position
    handleScrollAndResize();

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, [liftDone, imgLoaded]);

  // Track scroll overlap of Dark Sections (Section 5 and Section 6) on Viewport Top to Color Navigation
  useEffect(() => {
    const handleNavScroll = () => {
      const s5 = section5Ref.current?.getBoundingClientRect();
      const s6 = section6Ref.current?.getBoundingClientRect();

      const isDark5 = s5 ? s5.top <= 0 && s5.bottom > 0 : false;
      const isDark6 = s6 ? s6.top <= 0 && s6.bottom > 0 : false;

      setNavOnDark(isDark5 || isDark6);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Run initially

    return () => {
      window.removeEventListener('scroll', handleNavScroll);
    };
  }, []);

  // Determine active nav colors
  const navColor = navOnDark ? '#ffffff' : '#213138';

  return (
    <div className="bg-[#f5f0ea] min-h-screen w-full overflow-x-clip relative font-['Inter'] antialiased text-[#213138]">
      {/* Google Fonts and CSS Overrides Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

        body {
          background-color: #f5f0ea;
          font-family: 'Inter', sans-serif;
          overflow-x: clip;
        }

        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }

        .cursor-blink {
          animation: blink 0.7s step-end infinite;
        }

        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 35s linear infinite;
        }

        /* Desktop Gallery Accordion hover mechanism */
        @media (min-width: 1024px) {
          .gallery-expand-row:hover .gallery-expand-item {
            flex: 0.5 !important;
          }
          .gallery-expand-row .gallery-expand-item:hover {
            flex: 4 !important;
          }
        }

        /* Hero Responsive Type Sizes */
        @media (max-width: 639px) {
          .hero-subtitle-desktop { display: none !important; }
          .hero-subtitle-mobile  { display: block !important; }
          .hero-text-block { padding-top: 90px !important; }
          .hero-heading-top { justify-content: flex-start !important; }
          .hero-own-the { font-size: 7.5vw !important; }
          .hero-extraordinary { font-size: 14.5vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-subtitle-desktop { display: none !important; }
          .hero-subtitle-mobile  { display: block !important; }
          .hero-text-block { padding-top: 110px !important; }
          .hero-heading-top { justify-content: flex-start !important; }
          .hero-own-the { font-size: 5.5vw !important; }
          .hero-extraordinary { font-size: 11vw !important; white-space: normal !important; word-break: break-word !important; line-height: 0.9 !important; }
        }
        @media (min-width: 1024px) {
          .hero-subtitle-desktop { display: block !important; }
          .hero-subtitle-mobile  { display: none !important; }
          .hero-text-block { padding-top: calc(28vh - 50px) !important; }
          .hero-own-the { font-size: 3vw !important; }
          .hero-extraordinary { font-size: clamp(52px, 6.5vw, 9vw) !important; white-space: nowrap !important; line-height: 0.88 !important; }
        }

        /* Dark Section Tablet/Mobile rules */
        @media (max-width: 767px) {
          .s2-statement-wrapper, .s2-stats-row {
            padding-left: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .s2-statement-wrapper, .s2-stats-row {
            padding-left: 15% !important;
          }
          .s2-section {
            min-height: 70vh !important;
            height: auto !important;
          }
        }
        @media (min-width: 1024px) {
          .s2-statement-wrapper, .s2-stats-row {
            padding-left: 25% !important;
          }
        }

        /* Gallery Responsive Rules (<=1023px) */
        @media (max-width: 1023px) {
          .s3-gallery-section { height: auto !important; min-height: 100vh !important; overflow: visible !important; }
          .s3-ticker-wrap { position: sticky !important; top: 0 !important; height: 100vh !important; width: 100% !important; margin-bottom: -100vh !important; }
          .s3-gallery-content { height: auto !important; align-items: flex-start !important; padding: 80px 16px 60px !important; }
          .gallery-expand-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; height: auto !important; width: 100% !important; max-width: 700px !important; }
          .gallery-expand-item { flex: none !important; height: auto !important; aspect-ratio: 4/5 !important; border-radius: 10px !important; transition: transform 0.3s ease !important; }
          .gallery-expand-item:hover { flex: none !important; transform: scale(1.02) !important; }
          .gallery-expand-item:last-child:nth-child(odd) { grid-column: 1 / -1 !important; max-width: calc(50% - 4px) !important; justify-self: center !important; }
        }

        @media (max-width: 479px) {
          .s3-gallery-content { padding: 60px 12px 48px !important; }
          .gallery-expand-row { gap: 6px !important; }
        }
      `}</style>

      {/* SECTION 1 — Preloader / Intro Overlay */}
      <div
        id="preloader-overlay"
        className="fixed inset-0 flex items-center justify-center bg-[#213138] z-[100]"
        style={{
          transform: lifting ? 'translateY(-100%)' : 'translateY(0%)',
          transition: liftDone ? 'none' : 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1)',
        }}
      >
        <div className="flex items-center text-white font-['Syne'] text-[2.6rem] tracking-[-0.02em] select-none">
          {FULL_TEXT.split('').map((char, index) => {
            if (index >= typedLength) return null;
            const isDot = char === '.';
            return (
              <span
                key={index}
                className={isDot ? 'font-black' : 'font-bold'}
              >
                {char}
              </span>
            );
          })}
          {!hideCursor && (
            <span className="inline-block w-[3px] h-[1.1em] rounded-sm bg-white ml-0.5 cursor-blink align-middle" />
          )}
        </div>
      </div>

      {/* SECTION 2 — Fixed Navigation */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-5 md:py-6 flex justify-between items-center select-none"
      >
        {/* Left: Brand Wordmark */}
        <a
          href="#"
          className="font-['Syne'] text-xl tracking-tight leading-none transition-colors duration-350"
          style={{
            color: navColor,
            transition: 'color 0.35s ease',
          }}
        >
          <span className="font-bold">Velar</span>
          <span className="font-black">.</span>
        </a>

        {/* Right: Hamburger button with shrinking hover animation or Close button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-8 h-8 flex flex-col justify-center items-end gap-1.5 focus:outline-none group z-[51] cursor-pointer"
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMenuOpen ? (
            <X
              size={24}
              style={{
                color: '#213138', // Black overlay contrast
                transition: 'color 0.35s ease',
              }}
            />
          ) : (
            <>
              <span
                className="h-[1.5px] w-[28px] group-hover:w-[20px]"
                style={{
                  backgroundColor: navColor,
                  transition: 'background-color 0.35s ease, width 0.3s ease',
                }}
              />
              <span
                className="h-[1.5px] w-[28px]"
                style={{
                  backgroundColor: navColor,
                  transition: 'background-color 0.35s ease',
                }}
              />
            </>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 bg-[#f5f0ea] z-40 flex flex-col justify-center items-center"
        >
          <div className="flex flex-col items-center gap-8 md:gap-10">
            {['Residences', 'Story', 'Listings', 'Inquire'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="font-light tracking-[0.2em] text-4xl uppercase text-[#213138] hover:text-gray-500 transition-colors duration-300 font-['Syne']"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3 — Hero */}
      <section
        id="hero-section"
        ref={heroRef}
        className="relative min-h-screen overflow-visible bg-cover bg-center bg-no-repeat flex flex-col justify-start"
        style={{
          backgroundImage: `url('${BG_IMG}')`,
        }}
      >
        {/* Animated Hero Text Content */}
        <div
          className="hero-text-block w-full z-10 transition-all select-none"
          style={{
            opacity: showHeroText ? 1 : 0,
            transform: showHeroText ? 'translateY(0)' : 'translateY(-28px)',
            transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
          }}
        >
          {/* Top heading row */}
          <div className="hero-heading-top px-6 md:px-10 lg:px-16 flex items-end justify-between mb-[-0.04em]">
            <h1 className="hero-own-the font-['Syne'] font-[800] uppercase text-[#213138] tracking-[-0.03em] leading-none">
              LIVE IN
            </h1>

            {/* Desktop only subtitle */}
            <p className="hero-subtitle-desktop text-right font-['Syne'] font-bold text-[#213138] max-w-[300px] opacity-70 leading-[1.6] mb-[0.2em] tracking-[0.02em]">
              Stately homes built with vision,<br />
              scope, and architectural finesse.
            </p>
          </div>

          {/* Headline row */}
          <div className="overflow-hidden">
            <h1 className="hero-extraordinary font-['Syne'] font-[800] uppercase text-[#213138] tracking-[-0.03em] px-6 md:px-10 lg:px-16 leading-[0.88]">
              IRREPLACEABLE
            </h1>
          </div>

          {/* Mobile/Tablet Subtitle */}
          <div className="hero-subtitle-mobile px-6 font-['Syne'] font-semibold text-[#213138] opacity-65 mt-[0.9em]">
            Premium real estate with vision,<br />
            depth, and architectural clarity.
          </div>
        </div>
      </section>

      {/* SECTION 4 — Scroll-Driven House Animation */}
      <div
        id="house-fixed-container"
        style={
          !liftDone
            ? {
                position: 'fixed',
                zIndex: 22,
                pointerEvents: 'none',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                minWidth: '1400px',
              }
            : houseTransform.progress <= 0
            ? {
                position: 'fixed',
                zIndex: 22,
                pointerEvents: 'none',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                minWidth: '1400px',
              }
            : {
                position: 'fixed',
                zIndex: 22,
                pointerEvents: 'none',
                top: 0,
                left: 0,
                transform: `translate(${houseTransform.currentX}px, ${houseTransform.currentY}px) scale(${houseTransform.currentScale})`,
                transformOrigin: 'top left',
                width: `${houseTransform.baseW}px`,
                minWidth: '1400px',
              }
        }
      >
        <div
          id="house-inside-transition"
          style={
            !liftDone
              ? {
                  transform: lifting ? 'translateY(0)' : 'translateY(102vh)',
                  transition: 'transform 1.5s cubic-bezier(0.45, 0, 0.15, 1) 0.4s',
                }
              : {
                  transform: 'translateY(0)',
                }
          }
        >
          <img
            ref={houseImgRef}
            src={HOUSE_IMG}
            alt="Velar Luxury Mansion Showcase"
            aria-hidden="true"
            className="w-full h-auto select-none pointer-events-none block"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      </div>

      {/* SECTION 5 — Dark Statement + Stats (sticky) */}
      <div
        id="story"
        className="relative z-20"
        style={{ height: '200vh' }}
      >
        {/* Tiny 4vh #1a1a1a scroll spacer */}
        <div className="h-[4vh] bg-[#1a1a1a]" />

        {/* Sticky section container */}
        <section
          ref={section5Ref}
          className="s2-section sticky top-0 h-[100vh] bg-[#1a1a1a] overflow-hidden flex items-center"
        >
          <div className="s2-content w-full flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-[clamp(30px,4vw,60px)] pb-[clamp(60px,8vw,120px)] max-w-[1200px] mx-auto select-none">
            {/* Statement Text Block */}
            <div className="s2-statement-wrapper w-full mb-6">
              <h2 className="s2-statement font-['Inter'] font-light text-[#e8e4df] tracking-[-0.02em] leading-[1.35] text-[clamp(22px,2.6vw,42px)]">
                Every estate we present is hand-chosen<br />
                through a frame of permanence, refinement,<br />
                and timeless detail. Standards are not<br />
                a flourish. It is our discipline.
              </h2>
            </div>

            {/* Stats Row */}
            <div className="s2-stats-row w-full flex flex-row items-stretch gap-4 mt-[clamp(48px,6vw,80px)]">
              {/* Stat Column 1 */}
              <div className="flex-1 border-r border-white/20 last:border-r-0">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={120} suffix="+" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Portfolio Holdings
                </p>
              </div>

              {/* Stat Column 2 */}
              <div className="flex-1 border-r border-white/20 last:border-r-0 pl-[clamp(20px,2.5vw,40px)]">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={12} suffix="" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Global Locations
                </p>
              </div>

              {/* Stat Column 3 */}
              <div className="flex-1 border-r border-white/20 last:border-r-0 pl-[clamp(20px,2.5vw,40px)]">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={98} suffix="%" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Patron Loyalty Rate
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 6 — Hover-Expand Gallery (slides over Section 5) */}
      <section
        id="residences"
        ref={section6Ref}
        className="s3-gallery-section relative z-25 mt-[-100vh] bg-[#1a1a1a] h-[100vh] overflow-hidden"
      >
        {/* Background Ticker */}
        <div className="s3-ticker-wrap absolute inset-0 flex items-center overflow-hidden z-0 pointer-events-none">
          <div className="ticker-track">
            {/* Direct giant repeating string spans */}
            <span className="font-['Syne'] font-extrabold text-[clamp(100px,14vw,220px)] text-white/[0.03] tracking-tighter select-none whitespace-nowrap pr-[0.3em] uppercase">
              Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;
            </span>
            <span className="font-['Syne'] font-extrabold text-[clamp(100px,14vw,220px)] text-white/[0.03] tracking-tighter select-none whitespace-nowrap pr-[0.3em] uppercase">
              Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;Velar.&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="s3-gallery-content relative z-10 flex items-center justify-center w-full h-full p-[clamp(24px,4vw,60px)]">
          <div className="gallery-expand-row flex w-full h-[70vh] gap-1.5 max-w-[1200px] justify-center items-stretch">
            {GALLERY_VIDEOS.map((videoUrl, idx) => (
              <div
                key={idx}
                className="gallery-expand-item flex-[1_1_0%] h-full rounded-[12px] overflow-hidden cursor-pointer relative transition-all duration-500 ease-out"
              >
                <video
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover select-none pointer-events-none block"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

