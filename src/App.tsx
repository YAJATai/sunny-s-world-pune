import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Phone, Mail } from 'lucide-react';

const FULL_TEXT = "Sunny's World.";
const HERO_IMG = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=85';
const ABOUT_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85';

const SERVICES = [
  {
    title: 'Wedding',
    desc: 'Destination weddings designed to perfection — elegant venues, world-class catering, and seamless execution.',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=85',
  },
  {
    title: 'Corporate',
    desc: 'Purpose-built event spaces for conferences, team outings, and training programs with 100+ activities.',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=85',
  },
  {
    title: 'Adventure',
    desc: 'Over 100 thrilling activities — from zip-lining to rock climbing at Tiger\'s Eye Adventure Resort.',
    img: 'https://images.unsplash.com/photo-1628891435222-0659256bcdc9?w=800&q=85',
  },
  {
    title: 'Resort Stay',
    desc: 'Luxurious rooms and villas spread across 100 acres of pristine nature and landscaped gardens.',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=85',
  },
  {
    title: 'Restaurant',
    desc: 'The Ruby — a hilltop fine-dining experience with panoramic views and an exquisite multi-cuisine menu.',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85',
  },
  {
    title: 'Sports',
    desc: 'A full-scale sports kingdom with cricket, football, basketball, swimming, and indoor gaming arenas.',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=85',
  },
];

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        let start: number | null = null;
        const dur = 2000;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <div ref={ref} className="tabular-nums">{value}{suffix}</div>;
}

export default function App() {
  const [typed, setTyped] = useState(0);
  const [hideCursor, setHideCursor] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [showText, setShowText] = useState(false);
  const [navDark, setNavDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 0; i <= FULL_TEXT.length; i++) {
      timers.push(window.setTimeout(() => setTyped(i), 600 + i * 140));
    }
    const LIFT_AT = 600 + FULL_TEXT.length * 140 + 700;
    timers.push(window.setTimeout(() => setHideCursor(true), LIFT_AT - 150));
    timers.push(window.setTimeout(() => setLifting(true), LIFT_AT));
    timers.push(window.setTimeout(() => setShowText(true), LIFT_AT + 1300));
    timers.push(window.setTimeout(() => setLifting(false), LIFT_AT + 2100));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const rect = aboutRef.current?.getBoundingClientRect();
      setNavDark(rect ? rect.top <= 0 && rect.bottom > 0 : false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navColor = navDark ? '#ffffff' : '#213138';
  const NAV = ['Resort', 'Wedding', 'Corporate', 'Adventure', 'Contact'];

  return (
    <div className="bg-[#f5f0ea] min-h-screen w-full overflow-x-clip relative font-['Inter'] antialiased text-[#213138]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        body { background-color: #f5f0ea; font-family: 'Inter', sans-serif; overflow-x: clip; margin: 0; }
        @keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }
        .cb { animation: blink 0.7s step-end infinite; }
        @media (max-width: 639px) {
          .hero-sub-desktop { display: none !important; }
          .hero-sub-mobile { display: block !important; }
          .hero-pt { padding-top: 100px !important; }
          .hero-sm { font-size: 8vw !important; }
          .hero-lg { font-size: 15vw !important; white-space: normal !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .hero-sub-desktop { display: none !important; }
          .hero-sub-mobile { display: block !important; }
          .hero-pt { padding-top: 120px !important; }
          .hero-sm { font-size: 5.5vw !important; }
          .hero-lg { font-size: 11vw !important; white-space: normal !important; }
        }
        @media (min-width: 1024px) {
          .hero-sub-desktop { display: block !important; }
          .hero-sub-mobile { display: none !important; }
          .hero-pt { padding-top: calc(28vh - 50px) !important; }
          .hero-sm { font-size: 3vw !important; }
          .hero-lg { font-size: clamp(56px, 7vw, 130px) !important; white-space: nowrap !important; }
        }
        .inp { width: 100%; padding: 12px 16px; background: transparent; border: 1px solid rgba(33,49,56,0.2); border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; color: #213138; outline: none; transition: border-color 0.3s; }
        .inp:focus { border-color: #213138; }
        .inp::placeholder { color: rgba(33,49,56,0.4); }
      `}</style>

      {/* Preloader */}
      <div className="fixed inset-0 flex items-center justify-center bg-[#213138] z-[100] select-none"
        style={{
          transform: lifting ? 'translateY(-100%)' : 'translateY(0%)',
          transition: 'transform 1.5s cubic-bezier(0.45,0,0.15,1)',
        }}
      >
        <div className="flex items-center text-white font-['Syne'] text-[2.6rem] tracking-[-0.02em]">
          {FULL_TEXT.split('').map((c, i) =>
            i < typed ? <span key={i} className={c === '.' ? 'font-black' : 'font-bold'}>{c}</span> : null
          )}
          {!hideCursor && <span className="inline-block w-[3px] h-[1.1em] rounded-sm bg-white ml-0.5 cb align-middle" />}
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-16 py-5 md:py-6 flex justify-between items-center select-none">
        <a href="#" className="font-['Syne'] text-xl tracking-tight leading-none" style={{ color: navColor, transition: 'color 0.35s' }}>
          <span className="font-bold">Sunny's</span><span className="font-black"> World</span>
        </a>
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="relative w-8 h-8 flex flex-col justify-center items-end gap-1.5 focus:outline-none group z-[51] cursor-pointer"
          aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {menuOpen ? <X size={24} style={{ color: '#213138' }} /> : (
            <>
              <span className="h-[1.5px] w-[28px] group-hover:w-[20px]" style={{ backgroundColor: navColor, transition: 'background-color 0.35s, width 0.3s' }} />
              <span className="h-[1.5px] w-[28px]" style={{ backgroundColor: navColor, transition: 'background-color 0.35s' }} />
            </>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-[#f5f0ea] z-40 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center gap-8 md:gap-10">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className="font-light tracking-[0.2em] text-4xl uppercase text-[#213138] hover:text-gray-500 transition-colors duration-300 font-['Syne']"
              >{l}</a>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-start"
        style={{ backgroundImage: `url('${HERO_IMG}')` }}
      >
        <div className="absolute inset-0 bg-black/35 z-0" />
        <div className="hero-pt w-full z-10 select-none"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? 'translateY(0)' : 'translateY(-28px)',
            transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s',
          }}
        >
          <div className="px-6 md:px-10 lg:px-16 flex items-end justify-between mb-[-0.04em]">
            <h1 className="hero-sm font-['Syne'] font-[800] uppercase text-white tracking-[-0.03em] leading-none">
              BEST RESORT IN PUNE
            </h1>
            <p className="hero-sub-desktop text-right font-['Syne'] font-bold text-white/80 max-w-[280px] leading-[1.6] mb-[0.2em] tracking-[0.02em]">
              Weddings, Corporate Events,<br />Adventure &amp; Luxury Stays
            </p>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-lg font-['Syne'] font-[800] uppercase text-white tracking-[-0.03em] px-6 md:px-10 lg:px-16 leading-[0.88]">
              A PERFECT DESTINATION
            </h1>
          </div>
          <div className="hero-sub-mobile px-6 font-['Syne'] font-semibold text-white/80 mt-[0.9em]">
            Weddings, corporate events,<br />adventure &amp; luxury stays.
          </div>
        </div>
      </section>

      {/* About + Stats */}
      <section ref={aboutRef} id="about" className="relative bg-[#1a1a1a] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-['Syne'] font-[800] text-[clamp(28px,3.5vw,48px)] text-white uppercase tracking-[-0.02em] leading-[1.1] mb-6">
                A World of Its Own
              </h2>
              <p className="font-['Inter'] font-light text-[#e8e4df]/80 leading-relaxed text-[clamp(15px,1.1vw,18px)]">
                Spread across 100 acres amidst nature, Sunny's World is a different world in itself.
                From grand destination weddings to high-energy corporate events, thrilling adventure
                sports to peaceful luxury stays — every experience is crafted with care.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img src={ABOUT_IMG} alt="Sunny's World Resort" className="w-full h-[300px] md:h-[400px] object-cover" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { end: 10, suffix: 'k+', label: 'Restaurant Guests' },
              { end: 50, suffix: 'k+', label: 'Adventure Visitors' },
              { end: 100, suffix: '+', label: 'Weddings Hosted' },
              { end: 500, suffix: '+', label: 'Corporate Events' },
            ].map((s, i) => (
              <div key={i} className="text-center border-r border-white/10 last:border-r-0">
                <div className="font-['Inter'] font-light text-white text-[clamp(36px,4vw,64px)] leading-none">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <p className="font-['Inter'] font-normal text-white/50 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 md:py-28 bg-[#f5f0ea]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center mb-14">
            <h2 className="font-['Syne'] font-[800] text-[clamp(28px,3.5vw,48px)] uppercase tracking-[-0.02em] leading-[1.1]">
              Everything Under One Sky
            </h2>
            <p className="font-['Inter'] text-[#213138]/60 mt-4 max-w-xl mx-auto">
              Six distinct experiences, one legendary destination.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-52 overflow-hidden">
                  <img src={s.img} alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-['Syne'] font-bold text-lg tracking-tight mb-2">{s.title}</h3>
                  <p className="font-['Inter'] text-[#213138]/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28 bg-[#f5f0ea] border-t border-[#213138]/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-['Syne'] font-[800] text-[clamp(32px,4vw,56px)] uppercase tracking-[-0.03em] leading-[0.95] mb-6">Get In Touch</h2>
              <p className="font-['Inter'] text-[#213138]/60 leading-relaxed mb-8 max-w-md">
                Whether it's a wedding inquiry, corporate event, or a weekend getaway — let's make it happen.
              </p>
              <div className="space-y-4">
                {[
                  { Icon: MapPin, text: 'Sr. No. 217, Pashan Sus Rd, Near Mumbai-Pune Bypass, Highway, Pune, Maharashtra 412115' },
                  { Icon: Phone, text: '+91-9667555555', href: 'tel:+919667555555' },
                  { Icon: Mail, text: 'admin@sunnysworldpune.com', href: 'mailto:admin@sunnysworldpune.com' },
                ].map(({ Icon, text, href }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Icon size={18} className="mt-0.5 shrink-0 text-[#213138]/50" />
                    {href
                      ? <a href={href} className="font-['Inter'] text-sm text-[#213138]/70 hover:text-[#213138] transition-colors">{text}</a>
                      : <p className="font-['Inter'] text-sm text-[#213138]/70 leading-relaxed">{text}</p>
                    }
                  </div>
                ))}
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="inp" />
                <input type="text" placeholder="Company Name" className="inp" />
                <input type="tel" placeholder="Mobile No" className="inp" />
                <input type="email" placeholder="Email ID" className="inp" />
                <select className="inp appearance-none">
                  <option>Corporate Events</option>
                  <option>Wedding</option>
                  <option>Adventure Sports</option>
                  <option>Restaurant</option>
                  <option>Resort Stay</option>
                </select>
                <input type="date" className="inp" defaultValue="2026-06-24" />
                <input type="number" placeholder="Number of PAX" className="inp" defaultValue={100} />
                <button type="submit" className="w-full py-3 bg-[#213138] text-white font-['Syne'] font-bold text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#2c434a] transition-colors cursor-pointer">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-12">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-['Syne'] font-bold text-white text-lg mb-3">Sunny's World</h3>
              <p className="font-['Inter'] text-white/40 text-sm leading-relaxed">
                The Best and Luxurious Resort in Pune. Spread across 100 Acres Amidst Nature.
              </p>
            </div>
            <div>
              <h4 className="font-['Syne'] font-semibold text-white/60 text-sm uppercase tracking-[0.15em] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Wedding', 'Corporate', 'Adventure Park', 'Resort', 'Contact'].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase().replace(/\s+/g, '')}`} className="font-['Inter'] text-white/30 text-sm hover:text-white/60 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-['Syne'] font-semibold text-white/60 text-sm uppercase tracking-[0.15em] mb-4">Address</h4>
              <p className="font-['Inter'] text-white/30 text-sm leading-relaxed">
                Sr. No. 217, Pashan Sus Road, Near Mumbai-Pune Bypass Highway, Pune, Maharashtra 412115
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="font-['Inter'] text-white/20 text-xs">Copyright &copy; 2026 Sunny's World Pune | Powered by Sunny's World Pune</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
