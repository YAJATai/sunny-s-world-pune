import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Phone, Mail } from 'lucide-react';

const FULL_TEXT = "Sunny's World.";
const RESORT_IMG = 'https://sunnysworldpune.com/wp-content/uploads/2022/06/Best-Wedding-Destination-in-India-1.png';
const BG_IMG = 'https://sunnysworldpune.com/wp-content/uploads/2022/06/WEDDING-1024x1017.jpg';

const GALLERY = [
  { label: 'Wedding', img: 'https://sunnysworldpune.com/wp-content/uploads/2022/06/Best-Wedding-Destination-in-India-1.png' },
  { label: 'Corporate', img: 'https://sunnysworldpune.com/wp-content/uploads/2022/06/Best-Destination-for-Corporate-Event-in-Pune.png' },
  { label: 'Adventure', img: 'https://sunnysworldpune.com/wp-content/uploads/2022/06/Best-Adventure-Park-in-India-1.png' },
  { label: 'Resort', img: 'https://sunnysworldpune.com/wp-content/uploads/2022/06/Sunnys-World-Adventure-Park.png' },
  { label: 'Restaurant', img: 'https://sunnysworldpune.com/wp-content/uploads/2021/11/The-Ruby-Hilltop-Restaurant-The-Only-Hilltop-Restaurant-In-Pune-at-Sunnys-World-1-1024x576.jpg' },
  { label: 'Sports', img: 'https://sunnysworldpune.com/wp-content/uploads/2022/06/Sunnys-World-Sports-Kingdom.png' },
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
  const [typedLength, setTypedLength] = useState(0);
  const [hideCursor, setHideCursor] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [showHeroText, setShowHeroText] = useState(false);
  const [liftDone, setLiftDone] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navOnDark, setNavOnDark] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const section5Ref = useRef<HTMLElement>(null);
  const section6Ref = useRef<HTMLElement>(null);
  const resortImgRef = useRef<HTMLImageElement>(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [resortTransform, setResortTransform] = useState({
    progress: 0,
    currentX: 0,
    currentY: 0,
    currentScale: 1,
    baseW: 1400,
  });

  useEffect(() => {
    const typeTimers: number[] = [];
    for (let i = 0; i <= FULL_TEXT.length; i++) {
      const timer = window.setTimeout(() => {
        setTypedLength(i);
      }, 600 + i * 140);
      typeTimers.push(timer);
    }

    const LIFT_AT = 600 + 11 * 140 + 700;

    const cursorTimer = window.setTimeout(() => {
      setHideCursor(true);
    }, LIFT_AT - 150);

    const liftTimer = window.setTimeout(() => {
      setLifting(true);
    }, LIFT_AT);

    const heroTextTimer = window.setTimeout(() => {
      setShowHeroText(true);
    }, LIFT_AT + 1300);

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

  useEffect(() => {
    if (!liftDone) return;

    const handleScrollAndResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const heroElement = heroRef.current;
      const darkElement = section5Ref.current;
      const imgElement = resortImgRef.current;

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

        setResortTransform({
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

    handleScrollAndResize();

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, [liftDone, imgLoaded]);

  useEffect(() => {
    const handleNavScroll = () => {
      const s5 = section5Ref.current?.getBoundingClientRect();
      const s6 = section6Ref.current?.getBoundingClientRect();

      const isDark5 = s5 ? s5.top <= 0 && s5.bottom > 0 : false;
      const isDark6 = s6 ? s6.top <= 0 && s6.bottom > 0 : false;

      setNavOnDark(isDark5 || isDark6);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    return () => {
      window.removeEventListener('scroll', handleNavScroll);
    };
  }, []);

  const navColor = navOnDark ? '#ffffff' : '#213138';

  const NAV_LINKS = ['Resort', 'Wedding', 'Corporate', 'Adventure', 'Restaurant', 'Contact'];

  return (
    <div className="bg-[#f5f0ea] min-h-screen w-full overflow-x-clip relative font-['Inter'] antialiased text-[#213138]">
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

        @media (min-width: 1024px) {
          .gallery-expand-row:hover .gallery-expand-item {
            flex: 0.5 !important;
          }
          .gallery-expand-row .gallery-expand-item:hover {
            flex: 4 !important;
          }
        }

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

        .contact-input {
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid rgba(33, 49, 56, 0.2);
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #213138;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .contact-input:focus {
          border-color: #213138;
        }
        .contact-input::placeholder {
          color: rgba(33, 49, 56, 0.4);
        }
      `}</style>

      {/* SECTION 1 — Preloader */}
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

      {/* SECTION 2 — Navigation */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-5 md:py-6 flex justify-between items-center select-none"
      >
        <a
          href="#"
          className="font-['Syne'] text-xl tracking-tight leading-none"
          style={{
            color: navColor,
            transition: 'color 0.35s ease',
          }}
        >
          <span className="font-bold">Sunny's</span>
          <span className="font-black"> World</span>
        </a>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-8 h-8 flex flex-col justify-center items-end gap-1.5 focus:outline-none group z-[51] cursor-pointer"
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMenuOpen ? (
            <X
              size={24}
              style={{
                color: '#213138',
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
            {NAV_LINKS.map((link) => (
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
        <div
          className="absolute inset-0 bg-black/20 z-0"
        />
        <div
          className="hero-text-block w-full z-10 transition-all select-none"
          style={{
            opacity: showHeroText ? 1 : 0,
            transform: showHeroText ? 'translateY(0)' : 'translateY(-28px)',
            transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
          }}
        >
          <div className="hero-heading-top px-6 md:px-10 lg:px-16 flex items-end justify-between mb-[-0.04em]">
            <h1 className="hero-own-the font-['Syne'] font-[800] uppercase text-[#f5f0ea] tracking-[-0.03em] leading-none">
              BEST RESORT IN PUNE
            </h1>

            <p className="hero-subtitle-desktop text-right font-['Syne'] font-bold text-[#f5f0ea] max-w-[300px] opacity-80 leading-[1.6] mb-[0.2em] tracking-[0.02em]">
              Weddings, Corporate Events,<br />
              Adventure & Luxury Stays.
            </p>
          </div>

          <div className="overflow-hidden">
            <h1 className="hero-extraordinary font-['Syne'] font-[800] uppercase text-[#f5f0ea] tracking-[-0.03em] px-6 md:px-10 lg:px-16 leading-[0.88]">
              A PERFECT DESTINATION
            </h1>
          </div>

          <div className="hero-subtitle-mobile px-6 font-['Syne'] font-semibold text-[#f5f0ea] opacity-80 mt-[0.9em]">
            Best resort in Pune for weddings,<br />
            corporate events &amp; adventure stays.
          </div>
        </div>
      </section>

      {/* SECTION 4 — Scroll-Driven Resort Image Animation */}
      <div
        id="resort-fixed-container"
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
            : resortTransform.progress <= 0
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
                transform: `translate(${resortTransform.currentX}px, ${resortTransform.currentY}px) scale(${resortTransform.currentScale})`,
                transformOrigin: 'top left',
                width: `${resortTransform.baseW}px`,
                minWidth: '1400px',
              }
        }
      >
        <div
          id="resort-inside-transition"
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
            ref={resortImgRef}
            src={RESORT_IMG}
            alt="Sunny's World Resort"
            aria-hidden="true"
            className="w-full h-auto select-none pointer-events-none block"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      </div>

      {/* SECTION 5 — Dark Statement + Stats */}
      <div
        id="about"
        className="relative z-20"
        style={{ height: '200vh' }}
      >
        <div className="h-[4vh] bg-[#1a1a1a]" />

        <section
          ref={section5Ref}
          className="s2-section sticky top-0 h-[100vh] bg-[#1a1a1a] overflow-hidden flex items-center"
        >
          <div className="s2-content w-full flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-[clamp(30px,4vw,60px)] pb-[clamp(60px,8vw,120px)] max-w-[1200px] mx-auto select-none">
            <div className="s2-statement-wrapper w-full mb-6">
              <h2 className="s2-statement font-['Inter'] font-light text-[#e8e4df] tracking-[-0.02em] leading-[1.35] text-[clamp(22px,2.6vw,42px)]">
                Spread across 100 acres amidst nature,<br />
                Sunny's World is a different world in itself —<br />
                created for weddings, corporate events,<br />
                adventure sports, and luxury stays.
              </h2>
            </div>

            <div className="s2-stats-row w-full flex flex-row items-stretch gap-4 mt-[clamp(48px,6vw,80px)]">
              <div className="flex-1 border-r border-white/20 last:border-r-0">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={10} suffix="k+" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Restaurant Users
                </p>
              </div>

              <div className="flex-1 border-r border-white/20 last:border-r-0 pl-[clamp(20px,2.5vw,40px)]">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={50} suffix="k+" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Adventure Users
                </p>
              </div>

              <div className="flex-1 border-r border-white/20 last:border-r-0 pl-[clamp(20px,2.5vw,40px)]">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={100} suffix="+" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Wedding Events
                </p>
              </div>

              <div className="flex-1 pl-[clamp(20px,2.5vw,40px)]">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4.5vw,72px)] leading-none flex items-baseline">
                  <CountUp end={500} suffix="+" />
                </div>
                <p className="font-['Inter'] font-normal text-white/60 text-[clamp(12px,1.1vw,16px)] mt-[clamp(4px,0.5vw,8px)] tracking-[0.01em]">
                  Corporate Events
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 6 — Gallery */}
      <section
        id="services"
        ref={section6Ref}
        className="s3-gallery-section relative z-25 mt-[-100vh] bg-[#1a1a1a] h-[100vh] overflow-hidden"
      >
        <div className="s3-ticker-wrap absolute inset-0 flex items-center overflow-hidden z-0 pointer-events-none">
          <div className="ticker-track">
            <span className="font-['Syne'] font-extrabold text-[clamp(100px,14vw,220px)] text-white/[0.03] tracking-tighter select-none whitespace-nowrap pr-[0.3em] uppercase">
              Sunny's World.&nbsp;&nbsp;&nbsp;Sunny's World.&nbsp;&nbsp;&nbsp;Sunny's World.&nbsp;&nbsp;&nbsp;Sunny's World.&nbsp;&nbsp;&nbsp;
            </span>
            <span className="font-['Syne'] font-extrabold text-[clamp(100px,14vw,220px)] text-white/[0.03] tracking-tighter select-none whitespace-nowrap pr-[0.3em] uppercase">
              Sunny's World.&nbsp;&nbsp;&nbsp;Sunny's World.&nbsp;&nbsp;&nbsp;Sunny's World.&nbsp;&nbsp;&nbsp;Sunny's World.&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>

        <div className="s3-gallery-content relative z-10 flex items-center justify-center w-full h-full p-[clamp(24px,4vw,60px)]">
          <div className="gallery-expand-row flex w-full h-[70vh] gap-1.5 max-w-[1200px] justify-center items-stretch">
            {GALLERY.map((item, idx) => (
              <div
                key={idx}
                className="gallery-expand-item flex-[1_1_0%] h-full rounded-[12px] overflow-hidden cursor-pointer relative transition-all duration-500 ease-out group"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover select-none pointer-events-none block"
                />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-['Syne'] text-white text-lg font-bold tracking-wide uppercase">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Contact */}
      <section
        id="contact"
        className="relative z-30 bg-[#f5f0ea] min-h-screen flex items-center py-20"
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Left — Info */}
            <div>
              <h2 className="font-['Syne'] font-[800] text-[clamp(32px,4vw,56px)] uppercase tracking-[-0.03em] leading-[0.95] mb-6 text-[#213138]">
                Get In<br />Touch
              </h2>
              <p className="font-['Inter'] text-[#213138]/70 leading-relaxed mb-8 max-w-md">
                We would love to hear from you. Whether it's a wedding inquiry,
                corporate event, or a weekend getaway — let's make it happen.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-[#213138]/60" />
                  <p className="font-['Inter'] text-sm text-[#213138]/80 leading-relaxed">
                    Sr. No. 217, Pashan Sus Rd, Near Mumbai-Pune Bypass,<br />
                    Highway, Pune, Maharashtra 412115
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="shrink-0 text-[#213138]/60" />
                  <a href="tel:+919667555555" className="font-['Inter'] text-sm text-[#213138]/80 hover:text-[#213138] transition-colors">
                    +91-9667555555
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="shrink-0 text-[#213138]/60" />
                  <a href="mailto:admin@sunnysworldpune.com" className="font-['Inter'] text-sm text-[#213138]/80 hover:text-[#213138] transition-colors">
                    admin@sunnysworldpune.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="contact-input" />
                <input type="text" placeholder="Company Name" className="contact-input" />
                <input type="tel" placeholder="Mobile No" className="contact-input" />
                <input type="email" placeholder="Email ID" className="contact-input" />
                <select className="contact-input appearance-none">
                  <option>Corporate Events</option>
                  <option>Wedding</option>
                  <option>Adventure Sports</option>
                  <option>Restaurant</option>
                  <option>Resort Stay</option>
                </select>
                <input type="date" placeholder="Booking Date" className="contact-input" defaultValue="2026-01-12" />
                <input type="number" placeholder="Number of PAX" className="contact-input" defaultValue={100} />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#213138] text-white font-['Syne'] font-bold text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#2c434a] transition-colors duration-300 cursor-pointer"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Footer */}
      <footer className="relative z-30 bg-[#1a1a1a] py-10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-['Syne'] font-bold text-white text-lg mb-3">
                Sunny's World
              </h3>
              <p className="font-['Inter'] text-white/50 text-sm leading-relaxed">
                The Best and Luxurious Resort in Pune.<br />
                Spread across 100 Acres Amidst Nature.
              </p>
            </div>
            <div>
              <h4 className="font-['Syne'] font-semibold text-white/70 text-sm uppercase tracking-[0.15em] mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {['Wedding', 'Corporate', 'Adventure Park', 'Resort', 'Restaurant', 'Contact'].map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase().replace(/\s+/g, '')}`} className="font-['Inter'] text-white/40 text-sm hover:text-white/70 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-['Syne'] font-semibold text-white/70 text-sm uppercase tracking-[0.15em] mb-3">Address</h4>
              <p className="font-['Inter'] text-white/40 text-sm leading-relaxed">
                Sr. No. 217, Pashan Sus Road,<br />
                Near Mumbai-Pune Bypass Highway,<br />
                Pune, Maharashtra 412115
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="font-['Inter'] text-white/30 text-xs">
              Copyright &copy; 2026 Sunny's World Pune | Powered by Sunny's World Pune
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
