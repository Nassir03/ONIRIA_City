"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { socialLinks } from "../data/socialLinks";
import { getAnonymousSessionId, subscribeNewsletter } from "../services/api";


const footerGroups = [
  {
    title: "Discover ONIRIA",
    links: [
      ["Vision", "/vision"],
      ["Masterplan", "/masterplan"],
      ["Lifestyle", "/lifestyle"],
      ["Architecture", "/architecture"],
      ["Amenities", "/amenities"],
      ["Gallery", "/gallery"],
      ["Journal", "/journal"],
    ],
  },
  {
    title: "Properties",
    links: [
      ["Villas", "/villas"],
      ["Residences", "/residences"],
      ["V Avenue", "/v-avenue"],
      ["Commercial Opportunities", "/commercial"],
      ["All Properties", "/properties"],
    ],
  },
  {
    title: "Sales and Enquiries",
    links: [
      ["Register Interest", "/inquiries"],
      ["Request Brochure", "/inquiries?type=brochure"],
      ["Book Consultation", "/inquiries?type=consultation"],
      ["Arrange Site Visit", "/inquiries?type=site-visit"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Investment and Resources",
    links: [
      ["Investment", "/investment"],
      ["FAQs", "/faqs"],
      ["Property Search", "/properties?view=search"],
      ["Location", "/contact#page-content"],
      ["Sitemap", "/sitemap"],
    ],
  },
  {
    title: "Trending Searches",
    links: [
      ["Two-Bedroom Villas", "/properties?type=villa&bedrooms=2"],
      ["Three-Bedroom Villas", "/properties?type=villa&bedrooms=3"],
      ["Four-Bedroom Villas", "/properties?type=villa&bedrooms=4"],
      ["Garden Residences", "/properties?collection=garden-residences"],
      ["Properties in Fumba", "/properties?location=fumba"],
      ["V Avenue Commercial Spaces", "/commercial"],
    ],
  },
];

function FooterAccordionGroup({ group, open, onToggle }) {
  const panelId = useId();

  return (
    <section className={`footerAccordionGroup ${open ? "isOpen" : ""}`}>
      <button
        type="button"
        className="footerAccordionButton"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.currentTarget.blur();
            onToggle();
          }
        }}
      >
        <span>{group.title}</span>
        <span aria-hidden="true" className="footerChevron">⌄</span>
      </button>
      <div id={panelId} className="footerAccordionPanel">
        <ul>
          {group.links.map(([label, href]) => (
            <li key={`${group.title}-${href}`}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openGroup, setOpenGroup] = useState(0);

  async function handleSubscribe(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setStatus({ type: "error", message: "Enter a valid email address." });
      return;
    }
    if (!consent) {
      setStatus({ type: "error", message: "Please confirm consent to receive ONIRIA City updates." });
      return;
    }

    setLoading(true);
    try {
      const result = await subscribeNewsletter({
        email: email.trim(),
        consent,
        anonymous_session_id: getAnonymousSessionId(),
      });
      setStatus({ type: "success", message: result.message || "You are subscribed to ONIRIA City updates." });
      setEmail("");
      setConsent(false);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Newsletter service is temporarily unavailable." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="oniriaFooter">
      <div className="oniriaFooterTopRow">
        <div className="oniriaFooterBrandBlock">
          <Link href="/" className="oniriaFooterLogo">ONIRIA CITY</Link>
          <div className="oniriaFooterSocials" aria-label="ONIRIA City social links">
            {socialLinks.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ONIRIA City on ${name}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <form className="oniriaFooterNewsletter" onSubmit={handleSubscribe}>
          <div className="oniriaFooterNewsletterRow">
            <label htmlFor="footer-newsletter-email" className="srOnly">Email address</label>
            <input
              id="footer-newsletter-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={loading}>{loading ? "SUBSCRIBING..." : "SUBSCRIBE"}</button>
          </div>
          <label className="oniriaFooterConsent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>I agree to receive approved ONIRIA City updates.</span>
          </label>
          {status.message && <p className={`oniriaFooterStatus ${status.type === "success" ? "isSuccess" : "isError"}`}>{status.message}</p>}
        </form>
      </div>

      <div className="oniriaFooterAccordions">
        {footerGroups.map((group, index) => (
          <FooterAccordionGroup
            key={group.title}
            group={group}
            open={openGroup === index}
            onToggle={() => setOpenGroup(openGroup === index ? -1 : index)}
          />
        ))}
      </div>

      <div className="oniriaFooterLegal">
        <nav aria-label="Footer legal links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
          <Link href="/cookie-policy">Cookie Policy</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/sitemap">Sitemap</Link>
        </nav>
        <p>© 2026 ONIRIA City. All rights reserved.</p>
      </div>
    </footer>
  );
}
