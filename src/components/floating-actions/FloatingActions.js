"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { services } from "@/data/services";
import styles from "./FloatingActions.module.css";

const WHATSAPP_NUMBER = "971544339700";

const STEP_PROMPTS = {
  name: "Hi! I'm the LEOS assistant. What's your name?",
  phone: (name) =>
    `Nice to meet you, ${name}. What's the best phone number to reach you on?`,
  service: "Great, thanks. Which service are you looking for?",
};

function createInitialMessages() {
  return [{ role: "bot", text: STEP_PROMPTS.name }];
}

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [step, setStep] = useState("name");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(createInitialMessages);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "" });

  const bodyRef = useRef(null);
  const inputRef = useRef(null);

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
    if (chatOpen && (step === "name" || step === "phone")) {
      inputRef.current?.focus();
    }
  }, [chatOpen, step]);

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
    setFormData({ name: "", phone: "", service: "" });
    setStep("name");
    setDraft("");
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpen((current) => !current);
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
        body: JSON.stringify(data),
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
    } else if (step === "phone") {
      setMessages((current) => [
        ...current,
        { role: "user", text: value },
        { role: "bot", text: STEP_PROMPTS.service },
      ]);
      setFormData((current) => ({ ...current, phone: value }));
      setStep("service");
    }

    setDraft("");
  }

  function handleServiceSelect(title) {
    const data = { ...formData, service: title };
    setFormData(data);
    setMessages((current) => [...current, { role: "user", text: title }]);
    setStep("sending");
    submitEnquiry(data);
  }

  const placeholder = step === "name" ? "Type your name…" : "Type your number…";
  const showTextInput = step === "name" || step === "phone";

  return (
    <div className={styles.dock}>
      {chatOpen ? (
        <div className={styles.panel} role="dialog" aria-label="Chat with LEOS">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelBrand}>LEOS Assistant</p>
              <p className={styles.panelStatus}>
                Usually replies within one business day
              </p>
            </div>

            <button
              type="button"
              aria-label="Close chat"
              onClick={toggleChat}
              className={styles.panelClose}
            >
              <CloseIcon />
            </button>
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
          aria-label={chatOpen ? "Close chat" : "Chat with us"}
          aria-expanded={chatOpen}
          onClick={toggleChat}
          className={`${styles.fab} ${styles.fabVisible}`}
        >
          {chatOpen ? <CloseIcon /> : <ChatIcon />}
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
