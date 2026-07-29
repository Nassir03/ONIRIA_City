"use client";

import { useEffect, useRef, useState } from "react";
import { askOniriaAI, getAnonymousSessionId } from "../services/api";

const quickQuestions = [
  "What properties are available?",
  "Tell me about the villas",
  "Can I arrange a site visit?",
  "Are there commercial spaces?",
];

const knowledgeBase = [
  {
    keywords: [
      "property",
      "properties",
      "available",
      "homes",
      "collections",
      "options",
    ],
    answer:
      "ONIRIA City currently presents three main property groups: private villas, modern residences and V Avenue commercial or mixed-use opportunities.",
    links: [
      {
        label: "Explore all properties",
        href: "/properties",
      },
      {
        label: "Make an inquiry",
        href: "/inquiries?type=property-information",
      },
    ],
  },
  {
    keywords: [
      "villa",
      "villas",
      "signature villa",
      "garden villa",
      "courtyard villa",
      "private home",
    ],
    answer:
      "The villa collection includes the Signature Four-Bedroom Villa, Three-Bedroom Garden Villa and Courtyard Villa. These homes are presented around privacy, gardens, family living and tropical architecture.",
    links: [
      {
        label: "View villas",
        href: "/villas",
      },
      {
        label: "Ask about villas",
        href: "/inquiries?type=property-information&collection=villas",
      },
    ],
  },
  {
    keywords: [
      "residence",
      "residences",
      "apartment",
      "apartments",
      "studio",
      "bedroom",
    ],
    answer:
      "The residence collection includes the Garden Residence, Island Residence and Studio Residence. The options range from compact one-bedroom homes to larger three-bedroom residences.",
    links: [
      {
        label: "View residences",
        href: "/residences",
      },
      {
        label: "Ask about residences",
        href: "/inquiries?type=property-information&collection=residences",
      },
    ],
  },
  {
    keywords: [
      "commercial",
      "office",
      "retail",
      "restaurant",
      "cafe",
      "business",
      "shop",
    ],
    answer:
      "V Avenue includes conceptual opportunities for retail, restaurants, cafés and professional office spaces within ONIRIA City’s mixed-use area.",
    links: [
      {
        label: "View commercial spaces",
        href: "/commercial",
      },
      {
        label: "Commercial inquiry",
        href: "/inquiries?type=commercial&collection=commercial",
      },
    ],
  },
  {
    keywords: [
      "visit",
      "site visit",
      "tour",
      "appointment",
      "viewing",
      "arrange",
    ],
    answer:
      "You can request a site visit through the inquiry form. Add your preferred date and contact method, and the ONIRIA team can follow up with you.",
    links: [
      {
        label: "Request a site visit",
        href: "/inquiries?type=site-visit",
      },
    ],
  },
  {
    keywords: [
      "consultation",
      "meeting",
      "call",
      "speak",
      "advisor",
      "sales team",
    ],
    answer:
      "You can request a consultation about property selection, investment goals or commercial opportunities through the ONIRIA inquiry page.",
    links: [
      {
        label: "Book a consultation",
        href: "/inquiries?type=consultation",
      },
      {
        label: "Contact the team",
        href: "/contact",
      },
    ],
  },
  {
    keywords: [
      "location",
      "where",
      "fumba",
      "zanzibar",
      "tanzania",
      "map",
    ],
    answer:
      "The ONIRIA City prototype presents the development in Fumba, Zanzibar, Tanzania. For approved location details, contact the project team directly.",
    links: [
      {
        label: "Explore the masterplan",
        href: "/masterplan",
      },
      {
        label: "Contact ONIRIA",
        href: "/contact",
      },
    ],
  },
  {
    keywords: [
      "price",
      "prices",
      "cost",
      "payment",
      "budget",
      "deposit",
      "installment",
    ],
    answer:
      "Confirmed prices and payment terms are not displayed in this prototype. Please submit an inquiry so the team can provide the latest approved information.",
    links: [
      {
        label: "Request pricing information",
        href: "/inquiries?type=property-information",
      },
    ],
  },
  {
    keywords: [
      "investment",
      "invest",
      "return",
      "ownership",
      "buyer",
      "purchase",
    ],
    answer:
      "ONIRIA presents residential and commercial ownership opportunities. Any investment decision should be based on current approved project, legal and financial information from the official team.",
    links: [
      {
        label: "Explore investment",
        href: "/investment",
      },
      {
        label: "Speak with the team",
        href: "/inquiries?type=consultation",
      },
    ],
  },
  {
    keywords: [
      "amenities",
      "pool",
      "gym",
      "fitness",
      "wellness",
      "park",
      "children",
      "facilities",
    ],
    answer:
      "The ONIRIA concept includes lifestyle, wellness, green spaces and community amenities. The amenities page presents the current prototype vision.",
    links: [
      {
        label: "Explore amenities",
        href: "/amenities",
      },
      {
        label: "Discover the lifestyle",
        href: "/lifestyle",
      },
    ],
  },
  {
    keywords: [
      "architecture",
      "design",
      "materials",
      "interior",
      "tropical",
      "style",
    ],
    answer:
      "ONIRIA’s architectural concept combines contemporary design with tropical living, natural light, landscaping and a connection between indoor and outdoor spaces.",
    links: [
      {
        label: "Explore architecture",
        href: "/architecture",
      },
    ],
  },
  {
    keywords: [
      "brochure",
      "document",
      "pdf",
      "download",
      "information pack",
    ],
    answer:
      "A final approved brochure is not connected to this prototype yet. You can request project information through the inquiry form.",
    links: [
      {
        label: "Request a brochure",
        href: "/inquiries?type=brochure",
      },
    ],
  },
  {
    keywords: [
      "contact",
      "email",
      "phone",
      "whatsapp",
      "message",
      "help",
    ],
    answer:
      "You can contact the ONIRIA team using the contact page, inquiry form or WhatsApp option.",
    links: [
      {
        label: "Contact page",
        href: "/contact",
      },
      {
        label: "Make an inquiry",
        href: "/inquiries",
      },
    ],
  },
];

const openingMessage = {
  id: "opening-message",
  sender: "assistant",
  text:
    "Welcome to ONIRIA City. I can help you explore properties, lifestyle, commercial opportunities and inquiry options.",
  links: [],
};

export default function OniriaAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([openingMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  function findAnswer(question) {
    const normalizedQuestion = question.toLowerCase();

    let bestMatch = null;
    let highestScore = 0;

    for (const item of knowledgeBase) {
      const score = item.keywords.reduce((total, keyword) => {
        return normalizedQuestion.includes(keyword)
          ? total + keyword.length
          : total;
      }, 0);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch) {
      return bestMatch;
    }

    return {
      answer:
        "I do not have a verified answer for that question in this prototype. Please contact the ONIRIA team so they can provide accurate and approved information.",
      links: [
        {
          label: "Contact the team",
          href: "/contact",
        },
        {
          label: "Submit an inquiry",
          href: "/inquiries",
        },
      ],
    };
  }

  async function sendMessage(question) {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || isTyping) {
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: cleanQuestion,
      links: [],
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await askOniriaAI({
        question: cleanQuestion,
        anonymous_session_id: getAnonymousSessionId(),
        page_path: window.location.pathname,
      });
      const assistantMessage = {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: response.answer,
        links: response.suggested_actions || [],
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch {
      const response = findAnswer(cleanQuestion);
      const assistantMessage = {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: response.answer,
        links: response.links,
      };
      setMessages((current) => [...current, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function resetConversation() {
    setMessages([openingMessage]);
    setInput("");
    setIsTyping(false);
  }

  return (
    <>
      <button
        type="button"
        className={`oniriaAIButton ${isOpen ? "oniriaAIButtonOpen" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close ONIRIA assistant" : "Open ONIRIA assistant"}
        title={isOpen ? "Close ONIRIA assistant" : "Open ONIRIA assistant"}
      >
        {isOpen ? (
          <span className="oniriaAICloseIcon">×</span>
        ) : (
          <span className="oniriaAIButtonMark" aria-hidden="true">O</span>
        )}
      </button>

      <section
        className={`oniriaAIChat ${isOpen ? "oniriaAIChatOpen" : ""}`}
        aria-hidden={!isOpen}
      >
        <header className="oniriaAIChatHeader">
          <div>
            <span className="oniriaAIChatLogo">O</span>

            <div>
              <strong>ONIRIA Assistant</strong>
              <small>
                <span /> Online prototype
              </small>
            </div>
          </div>

          <button
            type="button"
            onClick={resetConversation}
            aria-label="Restart conversation"
          >
            Restart
          </button>
        </header>

        <div className="oniriaAIChatNotice">
          This prototype uses prepared ONIRIA information and does not confirm
          pricing or availability.
        </div>

        <div className="oniriaAIMessages">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`oniriaAIMessage ${
                message.sender === "user"
                  ? "oniriaAIMessageUser"
                  : "oniriaAIMessageAssistant"
              }`}
            >
              {message.sender === "assistant" && (
                <span className="oniriaAIMessageAvatar">O</span>
              )}

              <div className="oniriaAIMessageContent">
                <p>{message.text}</p>

                {message.links.length > 0 && (
                  <div className="oniriaAIMessageLinks">
                    {message.links.map((link) => (
                      <a href={link.href} key={link.href}>
                        {link.label}
                        <span>→</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}

          {isTyping && (
            <article className="oniriaAIMessage oniriaAIMessageAssistant">
              <span className="oniriaAIMessageAvatar">O</span>

              <div className="oniriaAITyping">
                <span />
                <span />
                <span />
              </div>
            </article>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="oniriaAIQuickQuestions">
            <p>Suggested questions</p>

            <div>
              {quickQuestions.map((question) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="oniriaAIInputArea" onSubmit={handleSubmit}>
          <label htmlFor="oniria-ai-input" className="srOnly">
            Ask the ONIRIA assistant
          </label>

          <textarea
            ref={inputRef}
            id="oniria-ai-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            rows="1"
            placeholder="Ask about ONIRIA City..."
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            ↑
          </button>
        </form>

        <footer className="oniriaAIChatFooter">
          Verified project information should be confirmed with the ONIRIA
          team.
        </footer>
      </section>
    </>
  );
}
