"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { services } from "@/data/services";
import styles from "./FloatingActions.module.css";

const WHATSAPP_NUMBER = "971544339700";

// Session-only flag so the proactive "Kai" greeting bubble surfaces once
// per visit when the About section scrolls into view, not every time.
const TEASER_SESSION_KEY = "leos-chat-teaser-shown";

// UAE mobile (5XXXXXXXX) or landline (2/3/4/6/7/9 + 7 digits), with or
// without a +971/971/0 prefix, e.g. "050 123 4567", "04 345 1234",
// "+971 50 123 4567".
const UAE_PHONE_PATTERN = /^(?:\+?971|0)?(?:5\d{8}|[234679]\d{7})$/;

// Numbers from outside the UAE: require an explicit "+" and country code
// so it's unambiguous, roughly matching the international E.164 shape.
const INTERNATIONAL_PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhoneNumber(value) {
  const digits = value.replace(/[\s\-()]/g, "");
  return (
    UAE_PHONE_PATTERN.test(digits) || INTERNATIONAL_PHONE_PATTERN.test(digits)
  );
}

const SERVICE_LIST_TEXT = services
  .map((service, index) => `${index + 1}. ${service.title}`)
  .join("\n");

const STEP_PROMPTS = {
  name: "Hi! I'm Kai, your LEOS assistant. What's your name?",
  phone: (name) =>
    `Nice to meet you, ${name}. What's the best phone number to reach you on?`,
  invalidPhone:
    "That doesn't look like a valid phone number. For a UAE number, try 050 123 4567 or 04 345 1234. From outside the UAE, include your country code, e.g. +44 7911 123456.",
  email:
    "Thanks. What's your email address? This is optional — tap Skip if you'd rather not share it.",
  invalidEmail:
    "That doesn't look like a valid email address. Please try again, or tap Skip.",
  service: `Great, thanks. Which service are you looking for? Reply with a number, or tap one below.\n\n${SERVICE_LIST_TEXT}`,
  invalidService: `Please reply with a number from 1 to ${services.length}, or tap one of the services below.`,
};

function createInitialMessages() {
  return [{ role: "bot", text: STEP_PROMPTS.name }];
}

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [step, setStep] = useState("name");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(createInitialMessages);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });

  const dockRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const chatOpenRef = useRef(chatOpen);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 2;

      setShowBackToTop((current) => {
        const next = window.scrollY > threshold;
        return current === next ? current : next;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    body.scrollTop = body.scrollHeight;
  }, [messages, chatOpen]);

  useEffect(() => {
    if (chatOpen && (step === "name" || step === "phone" || step === "email")) {
      inputRef.current?.focus();
    }
  }, [chatOpen, step]);

  // Proactively surface Kai when a visitor scrolls to the About section,
  // once per browser session so it doesn't nag on repeat scroll-throughs.
  useEffect(() => {
    const target = document.getElementById("about");
    if (!target || sessionStorage.getItem(TEASER_SESSION_KEY)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        sessionStorage.setItem(TEASER_SESSION_KEY, "1");
        observer.disconnect();

        if (!chatOpenRef.current) setShowTeaser(true);
      },
      { threshold: 0.4 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Auto-dismiss the teaser if it's left untouched, so it doesn't linger.
  useEffect(() => {
    if (!showTeaser) return undefined;
    const timeout = setTimeout(() => setShowTeaser(false), 9000);
    return () => clearTimeout(timeout);
  }, [showTeaser]);

  // Mobile browsers don't shrink `100vh` when the keyboard opens, so a
  // fixed-position panel sized against it ends up partly covered. Track
  // the real visible area via visualViewport and shift/resize the panel
  // to stay fully within it.
  useEffect(() => {
    const viewport = window.visualViewport;
    const dock = dockRef.current;
    if (!viewport || !dock || !chatOpen) return undefined;

    function handleViewportChange() {
      const keyboardInset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      dock.style.setProperty("--keyboard-inset", `${keyboardInset}px`);
      dock.style.setProperty("--vv-height", `${viewport.height}px`);
    }

    handleViewportChange();
    viewport.addEventListener("resize", handleViewportChange);
    viewport.addEventListener("scroll", handleViewportChange);

    return () => {
      viewport.removeEventListener("resize", handleViewportChange);
      viewport.removeEventListener("scroll", handleViewportChange);
      dock.style.setProperty("--keyboard-inset", "0px");
    };
  }, [chatOpen]);

  const scrollToTop = useCallback(() => {
    // An animated scroll (native smooth or a GSAP tween) reliably stalls
    // partway on this site because it has to cross the home page's pinned
    // ScrollTrigger carousel, whose own recalculation fights the animation.
    // An instant jump sidesteps that conflict entirely and always lands
    // exactly at the top.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const resetChat = useCallback(() => {
    setMessages(createInitialMessages());
    setFormData({ name: "", phone: "", email: "", service: "" });
    setStep("name");
    setDraft("");
  }, []);

  const toggleChat = useCallback(() => {
    setShowTeaser(false);
    setChatOpen((current) => !current);
  }, []);

  const openChatFromTeaser = useCallback(() => {
    setShowTeaser(false);
    setChatOpen(true);
  }, []);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
  }, []);

  async function submitEnquiry(data) {
    setMessages((current) => [
      ...current,
      { role: "bot", text: "Sending your details to our team…" },
    ]);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, pageUrl: window.location.href }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text: `Thank you, ${data.name}. Your enquiry has been sent, our team will contact you on ${data.phone} shortly.`,
        },
      ]);
      setStep("done");
    } catch (submitError) {
      setMessages((current) => [
        ...current,
        {
          role: "bot",
          text:
            submitError.message ||
            "We couldn't send your enquiry. Please call or WhatsApp us directly.",
        },
      ]);
      setStep("error");
    }
  }

  function submitService(title) {
    const data = { ...formData, service: title };
    setFormData(data);
    setMessages((current) => [...current, { role: "user", text: title }]);
    setStep("sending");
    submitEnquiry(data);
  }

  function handleTextSubmit(event) {
    event.preventDefault();

    const value = draft.trim();
    if (!value) return;

    if (step === "name") {
      setMessages((current) => [
        ...current,
        { role: "user", text: value },
        { role: "bot", text: STEP_PROMPTS.phone(value) },
      ]);
      setFormData((current) => ({ ...current, name: value }));
      setStep("phone");
      setDraft("");
      return;
    }

    if (step === "phone") {
      if (!isValidPhoneNumber(value)) {
        setMessages((current) => [
          ...current,
          { role: "user", text: value },
          { role: "bot", text: STEP_PROMPTS.invalidPhone },
        ]);
        setDraft("");
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "user", text: value },
        { role: "bot", text: STEP_PROMPTS.email },
      ]);
      setFormData((current) => ({ ...current, phone: value }));
      setStep("email");
      setDraft("");
      return;
    }

    if (step === "email") {
      if (value.toLowerCase() === "skip") {
        skipEmail();
        return;
      }

      if (!EMAIL_PATTERN.test(value)) {
        setMessages((current) => [
          ...current,
          { role: "user", text: value },
          { role: "bot", text: STEP_PROMPTS.invalidEmail },
        ]);
        setDraft("");
        return;
      }

      setMessages((current) => [
        ...current,
        { role: "user", text: value },
        { role: "bot", text: STEP_PROMPTS.service },
      ]);
      setFormData((current) => ({ ...current, email: value }));
      setStep("service");
      setDraft("");
      return;
    }

    if (step === "service") {
      const choice = Number.parseInt(value, 10);

      if (
        !Number.isInteger(choice) ||
        choice < 1 ||
        choice > services.length
      ) {
        setMessages((current) => [
          ...current,
          { role: "user", text: value },
          { role: "bot", text: STEP_PROMPTS.invalidService },
        ]);
        setDraft("");
        return;
      }

      submitService(services[choice - 1].title);
      setDraft("");
    }
  }

  function handleServiceSelect(title) {
    submitService(title);
  }

  function skipEmail() {
    setMessages((current) => [
      ...current,
      { role: "user", text: "Skip" },
      { role: "bot", text: STEP_PROMPTS.service },
    ]);
    setFormData((current) => ({ ...current, email: "" }));
    setStep("service");
    setDraft("");
  }

  const placeholder =
    step === "name"
      ? "Type your name…"
      : step === "phone"
        ? "Type your phone number…"
        : step === "email"
          ? "Type your email, or tap Skip…"
          : "Type a number (1-7)…";
  const showTextInput =
    step === "name" || step === "phone" || step === "email" || step === "service";

  return (
    <div ref={dockRef} className={styles.dock}>
      {showTeaser && !chatOpen ? (
        <div className={styles.teaser}>
          <button
            type="button"
            onClick={openChatFromTeaser}
            className={styles.teaserBubble}
          >
            <span className={styles.teaserAvatar}>
              <Image
                src="/chat/avatar.png"
                alt=""
                width={40}
                height={40}
              />
            </span>
            <span className={styles.teaserText}>
              <strong>Kai</strong>
              <span>Hi! Need help with a renovation project?</span>
            </span>
          </button>

          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismissTeaser}
            className={styles.teaserClose}
          >
            <CloseIcon />
          </button>
        </div>
      ) : null}

      {chatOpen ? (
        <div className={styles.panel} role="dialog" aria-label="Chat with Kai, your LEOS assistant">
          <div className={styles.panelHeader}>
            <Image
              src="/chat/avatar-full.jpg"
              alt=""
              fill
              sizes="340px"
              className={styles.panelPhoto}
            />
            <div className={styles.panelHeaderOverlay} aria-hidden="true" />

            <button
              type="button"
              aria-label="Close chat"
              onClick={toggleChat}
              className={styles.panelClose}
            >
              <CloseIcon />
            </button>

            <div className={styles.panelHeaderText}>
              <p className={styles.panelBrand}>Kai</p>
              <p className={styles.panelStatus}>
                Usually replies within one business day
              </p>
            </div>
          </div>

          <div ref={bodyRef} className={styles.panelBody}>
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={
                  message.role === "bot" ? styles.bubbleBot : styles.bubbleUser
                }
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className={styles.panelFooter}>
            {step === "email" ? (
              <div className={styles.quickReplies}>
                <button
                  type="button"
                  onClick={skipEmail}
                  className={styles.quickReply}
                >
                  Skip
                </button>
              </div>
            ) : null}

            {step === "service" ? (
              <div className={styles.quickReplies}>
                {services.map((service) => (
                  <button
                    key={service.number}
                    type="button"
                    onClick={() => handleServiceSelect(service.title)}
                    className={styles.quickReply}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "done" || step === "error" ? (
              <button
                type="button"
                onClick={resetChat}
                className={styles.resetButton}
              >
                Start A New Enquiry
              </button>
            ) : null}

            {showTextInput ? (
              <form onSubmit={handleTextSubmit} className={styles.inputRow}>
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={placeholder}
                  aria-label={placeholder}
                  autoComplete="off"
                  required
                />
                <button type="submit" aria-label="Send">
                  <SendIcon />
                </button>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}

      {chatOpen ? null : (
        <div className={styles.buttons}>
          <button
            type="button"
            aria-label="Back to top"
            onClick={scrollToTop}
            className={`${styles.fab} ${showBackToTop ? styles.fabVisible : ""}`}
            tabIndex={showBackToTop ? 0 : -1}
          >
            <ArrowUpIcon />
          </button>

          <button
            type="button"
            aria-label="Chat with us"
            aria-expanded={chatOpen}
            onClick={toggleChat}
            className={`${styles.fab} ${styles.fabVisible}`}
          >
            <ChatIcon />
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with LEOS on WhatsApp"
            className={`${styles.fab} ${styles.fabVisible}`}
          >
            <WhatsAppIcon />
          </a>
        </div>
      )}
    </div>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4 4.5h16v11H8.5L4 19.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.44 1.34 4.94L2 22l5.24-1.37a9.9 9.9 0 0 0 4.8 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm0 18.2h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.24 8.24 0 1 1 7 3.85zm4.52-6.17c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.25-.64.8-.78.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}
