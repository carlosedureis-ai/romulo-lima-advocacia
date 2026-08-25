import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  ChatCircleText,
  HandHeart,
  InstagramLogo,
  List,
  MapPin,
  Plus,
  ShieldCheck,
  Target,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  contact,
  credentials,
  differentiators,
  navigation,
  pillars,
  socialSecurityTopics,
} from "./content";

const FORCE_FULL_MOTION =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("motion") === "full";

const WHATSAPP_URL = contact.whatsappNumber
  ? `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`
  : "";

const pillarIcons = {
  location: MapPin,
  practice: Briefcase,
  security: ShieldCheck,
};

const differentiatorIcons = {
  listen: ChatCircleText,
  strategy: Target,
  care: HandHeart,
};

const organicPaths = {
  about:
    "M-20 60 C130 142 270 38 430 94 C620 158 770 28 980 82 C1180 132 1300 42 1460 102 L1460 650 C1190 600 1040 730 780 675 C520 620 300 760 -20 610 Z",
  faq:
    "M-20 75 C245 20 420 108 650 72 C930 28 1190 18 1460 82 L1460 650 C1190 730 1035 620 780 682 C510 748 245 620 -20 710 Z",
  credentials:
    "M-20 65 C220 10 410 85 680 48 C940 12 1195 40 1460 92 L1460 370 C1180 320 960 380 690 342 C420 305 220 382 -20 325 Z",
};

function OrganicBackdrop({ variant }) {
  const drawStroke = variant === "about" || variant === "faq";

  return (
    <svg
      className="organic-backdrop"
      viewBox={variant === "credentials" ? "0 0 1440 410" : "0 0 1440 760"}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-reveal="organic"
      data-draw-stroke={drawStroke ? "true" : undefined}
    >
      <path d={organicPaths[variant]} pathLength="1" />
    </svg>
  );
}

function CredentialIcon({ type }) {
  const symbol = {
    id: (
      <>
        <path d="M13.5 20.5 24 14l10.5 6.5" />
        <path d="M15.5 22.5h17M17.5 22.5v9M22 22.5v9M26 22.5v9M30.5 22.5v9M15 33.5h18M13 36h22" />
      </>
    ),
    education: (
      <>
        <path d="m12.5 20.5 11.5-6 11.5 6L24 27l-11.5-6.5Z" />
        <path d="M17.5 24v7.5c4.2 2.8 8.8 2.8 13 0V24M35.5 20.5v8" />
        <circle cx="35.5" cy="30.5" r="1.25" />
      </>
    ),
    certificate: (
      <>
        <rect x="13.5" y="14.5" width="21" height="17" rx="1.5" />
        <path d="M17.5 19h13M17.5 23h8" />
        <circle cx="29" cy="29.5" r="5" />
        <path d="m26.5 33.8-.6 5.2 3.1-1.8 3.1 1.8-.6-5.2" />
      </>
    ),
    practice: (
      <>
        <path d="M24 13.5v22M15.5 18h17M19 36h10M16 38.5h16" />
        <circle cx="24" cy="15" r="1.5" />
        <path d="m16 18-4 9h8l-4-9ZM32 18l-4 9h8l-4-9Z" />
        <path d="M12 27c.8 2.6 2.1 3.8 4 3.8s3.2-1.2 4-3.8M28 27c.8 2.6 2.1 3.8 4 3.8s3.2-1.2 4-3.8" />
      </>
    ),
  }[type];

  return (
    <svg
      className="credential-mark"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="20.5" />
      {symbol}
    </svg>
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);
    updateMatch();
    media.addEventListener("change", updateMatch);
    return () => media.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}

function useRevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    root.classList.toggle("motion-full", FORCE_FULL_MOTION);

    const elements = [...document.querySelectorAll("[data-reveal]")];
    const pendingElements = new Set(elements);
    let observer;
    let revealFrame = 0;

    const revealElement = (element) => {
      if (!pendingElements.has(element)) return;
      element.setAttribute("data-visible", "true");
      pendingElements.delete(element);
      observer?.unobserve(element);
    };

    const revealReachedElements = () => {
      const revealLine = window.innerHeight * 0.85;
      pendingElements.forEach((element) => {
        if (element.getBoundingClientRect().top <= revealLine) revealElement(element);
      });
    };

    const scheduleRevealCheck = () => {
      if (revealFrame) return;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        revealReachedElements();
      });
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealElement(entry.target);
        });
        revealReachedElements();
      },
      { threshold: 0.15, rootMargin: "0px 0px -8%" },
    );

    elements.forEach((element) => observer.observe(element));
    window.addEventListener("scroll", scheduleRevealCheck, { passive: true });
    scheduleRevealCheck();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleRevealCheck);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
      root.classList.remove("motion-ready");
      root.classList.remove("motion-full");
    };
  }, []);
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Rômulo Lima, início">
      <span className="brand-mark" aria-hidden="true">
        RL
      </span>
      <span className="brand-copy">
        <strong>Rômulo Lima</strong>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={24} /> : <List size={26} />}
        </button>
        <nav id="main-navigation" className={open ? "site-nav is-open" : "site-nav"} aria-label="Principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ContactAction({ channel, children, className = "", onPending }) {
  const isWhatsApp = channel === "whatsapp";
  const href = isWhatsApp ? WHATSAPP_URL : contact.instagramUrl;
  const Icon = isWhatsApp ? WhatsappLogo : InstagramLogo;

  if (!href) {
    return (
      <button
        className={className}
        type="button"
        data-contact-placeholder="true"
        onClick={onPending}
      >
        <Icon size={22} weight="regular" aria-hidden="true" />
        <span>{children}</span>
      </button>
    );
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <Icon size={22} weight="regular" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

function Hero({ onPending }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion() && !FORCE_FULL_MOTION;
  const isMobile = useMediaQuery("(max-width: 760px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaTransform = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? ["translate3d(0, 0, 0) scale(1.01)", "translate3d(0, 18px, 0) scale(1.025)"]
      : ["translate3d(0, 0, 0) scale(1.01)", "translate3d(0, 34px, 0) scale(1.035)"],
  );

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" ref={ref}>
      <motion.div
        className="hero-media-depth"
        aria-hidden="true"
        style={{ transform: reduceMotion ? "translate3d(0, 0, 0) scale(1)" : mediaTransform }}
      >
        <div className="hero-media" />
      </motion.div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-person-reveal" aria-hidden="true" />
      <div className="hero-content layout-shell">
        <p className="hero-name">Advocacia Previdenciária em Santarém/PA</p>
        <h1 id="hero-title" aria-label="Seu direito merece atenção, técnica e respeito.">
          <span className="hero-line" aria-hidden="true">Seu direito</span>
          <span className="hero-line" aria-hidden="true">merece atenção,</span>
          <span className="hero-line" aria-hidden="true">técnica e respeito.</span>
        </h1>
        <p className="hero-support">Atuação em Direito Previdenciário, Cível e Trabalhista para Santarém e região.</p>
        <div className="hero-actions">
          <ContactAction channel="whatsapp" className="button button-primary" onPending={onPending}>
            Falar pelo WhatsApp
          </ContactAction>
          <ContactAction channel="instagram" className="text-action" onPending={onPending}>
            Instagram
          </ContactAction>
        </div>
      </div>
      <div id="hero-end" className="hero-end" aria-hidden="true" />
    </section>
  );
}

function About() {
  return (
    <section className="bank-section about-section" id="sobre" aria-labelledby="about-title">
      <OrganicBackdrop variant="about" />
      <div className="layout-shell about-grid">
        <figure className="portrait-frame" data-reveal="about-image" style={{ "--delay": "140ms" }}>
          <img src="/images/romulo-original.png" alt="Rômulo Lima usando terno preto e óculos" />
        </figure>
        <div className="about-copy" data-reveal="about-copy" style={{ "--delay": "220ms" }}>
          <h2 id="about-title">Advocacia feita com escuta, estratégia e responsabilidade.</h2>
          <p>
            Sou Rômulo Lima, advogado em Santarém/PA, com atuação voltada ao Direito Previdenciário, Cível e
            Trabalhista.
          </p>
          <p>
            Meu compromisso é orientar cada pessoa com clareza, cuidado e técnica, buscando soluções jurídicas
            seguras e adequadas à realidade de cada caso.
          </p>
          <p>
            Acredito que o direito só faz sentido quando aproxima, protege e transforma vidas com respeito.
          </p>
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="water-section pillars-section" id="atuacao" aria-labelledby="pillars-title">
      <div className="layout-shell">
        <h2 id="pillars-title" data-reveal="up">
          Presença local. Técnica jurídica. Compromisso real.
        </h2>
        <div className="pillar-list">
          {pillars.map((pillar, index) => {
            const Icon = pillarIcons[pillar.icon];
            return (
              <article
                key={pillar.title}
                className="pillar-item"
                data-reveal="pillar"
                style={{ "--delay": `${120 + index * 130}ms` }}
              >
                <Icon size={36} weight="thin" aria-hidden="true" />
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SocialSecurityFocus() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="bank-section focus-section" id="previdenciario" aria-labelledby="focus-title">
      <OrganicBackdrop variant="faq" />
      <div className="layout-shell focus-grid">
        <div className="focus-intro" data-reveal="up">
          <h2 id="focus-title">Entenda o caminho para proteger o seu direito.</h2>
          <p>Dúvidas comuns sobre benefícios previdenciários. Clique para saber mais.</p>
        </div>
        <div className="accordion">
          {socialSecurityTopics.map((topic, index) => {
            const isOpen = openIndex === index;
            const answerId = `answer-${index}`;
            return (
              <div
                className={isOpen ? "accordion-item is-open" : "accordion-item"}
                key={topic.question}
                data-reveal="faq-item"
                style={{ "--delay": `${120 + index * 100}ms` }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{topic.question}</span>
                  <Plus size={20} weight="regular" aria-hidden="true" />
                </button>
                <div className="accordion-answer" id={answerId} aria-hidden={!isOpen}>
                  <div>
                    <p>{topic.answer}</p>
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                      Conversar sobre meu caso <ArrowRight size={17} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Differentials() {
  return (
    <section className="water-section differentiators-section" aria-labelledby="differentiators-title">
      <div className="layout-shell differentiators-grid">
        <div className="differentiators-heading" data-reveal="up">
          <h2 id="differentiators-title">Cada pessoa merece ser compreendida por inteiro.</h2>
          <p>
            Mais do que processos, eu ofereço um atendimento que valoriza a sua história e busca caminhos reais
            para a sua tranquilidade.
          </p>
        </div>
        <div className="differentiator-list">
          {differentiators.map((item, index) => {
            const Icon = differentiatorIcons[item.icon];
            return (
              <article
                key={item.title}
                data-reveal="benefit"
                style={{ "--delay": `${120 + index * 120}ms` }}
              >
                <Icon size={34} weight="thin" aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section className="bank-section credentials-section" aria-labelledby="credentials-title">
      <OrganicBackdrop variant="credentials" />
      <div className="layout-shell">
        <div className="credentials-heading" data-reveal="up">
          <h2 id="credentials-title">Informações profissionais verificadas.</h2>
        </div>
        <div className="credential-list">
          {credentials.map((item, index) => {
            return (
              <div
                className="credential-item"
                key={item.label}
                data-reveal="credential"
                style={{ "--delay": `${120 + index * 110}ms` }}
              >
                <CredentialIcon type={item.icon} />
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact({ notice, onPending }) {
  return (
    <section className="contact-section" id="contato" aria-labelledby="contact-title">
      <div className="layout-shell contact-grid">
        <div data-reveal="cta-title">
          <h2 id="contact-title">Seu caso merece atenção desde a primeira conversa.</h2>
        </div>
        <div className="contact-actions" data-reveal="cta-actions" style={{ "--delay": "160ms" }}>
          <ContactAction channel="whatsapp" className="button button-primary" onPending={onPending}>
            Conversar pelo WhatsApp
          </ContactAction>
          <span className="contact-placeholder">WhatsApp: {contact.whatsappDisplay}</span>
          <ContactAction channel="instagram" className="text-action" onPending={onPending}>
            Acompanhar no Instagram
          </ContactAction>
          <p className="contact-notice" role="status" aria-live="polite">
            {notice}
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="layout-shell footer-copy">
        <p>Advocacia em Direito Previdenciário, Cível e Trabalhista em Santarém/PA.</p>
        <p>Atendimento com ética, técnica e respeito à sua história.</p>
        <p>Este site tem finalidade exclusivamente informativa.</p>
        <p>O atendimento é realizado mediante agendamento.</p>
      </div>
    </footer>
  );
}

function RiverFlow({ children }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion() && !FORCE_FULL_MOTION;
  const isMobile = useMediaQuery("(max-width: 760px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textureTransform = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? ["translate3d(-1%, 0, 0) scale(1.045)", "translate3d(1%, 56px, 0) scale(1.06)"]
      : ["translate3d(-2%, 0, 0) scale(1.055)", "translate3d(2%, 112px, 0) scale(1.085)"],
  );
  const currentTransform = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile
      ? ["translate3d(-1.5%, 0, 0) rotate(-0.15deg)", "translate3d(1.5%, 12px, 0) rotate(0.15deg)"]
      : ["translate3d(-3%, -8px, 0) rotate(-0.3deg)", "translate3d(3%, 24px, 0) rotate(0.3deg)"],
  );

  return (
    <main className="river-flow" ref={ref}>
      <motion.div
        className="river-texture"
        aria-hidden="true"
        style={{ transform: reduceMotion ? "translate3d(0, 0, 0) scale(1.04)" : textureTransform }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <span className="river-texture-panel" key={index} />
        ))}
      </motion.div>
      <motion.div
        className="river-current"
        aria-hidden="true"
        style={{ transform: reduceMotion ? "none" : currentTransform }}
      />
      <div className="river-glint" aria-hidden="true" />
      <div className="river-shade" aria-hidden="true" />
      {children}
    </main>
  );
}

function ScrollProgress() {
  const reduceMotion = useReducedMotion() && !FORCE_FULL_MOTION;
  const { scrollYProgress } = useScroll();
  const progressTransform = useTransform(scrollYProgress, (value) => `scaleX(${value})`);

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ transform: reduceMotion ? "scaleX(0)" : progressTransform }}
    />
  );
}

export default function App() {
  const [notice, setNotice] = useState("");
  useRevealOnScroll();

  const handlePendingContact = () => {
    setNotice("O canal será ativado assim que os dados oficiais forem fornecidos.");
  };

  return (
    <>
      <ScrollProgress />
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Header />
      <Hero onPending={handlePendingContact} />
      <div id="conteudo">
        <RiverFlow>
          <About />
          <Pillars />
          <SocialSecurityFocus />
          <Differentials />
          <Credentials />
          <Contact notice={notice} onPending={handlePendingContact} />
        </RiverFlow>
      </div>
      <Footer />
    </>
  );
}
