"use client";

import Link from "next/link";

export default function Footer() {
  function handleSubscribe(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("footerEmail");

    if (!emailInput?.value.trim()) {
      return;
    }

    alert(
      "Thank you for subscribing. Email delivery will be connected in the backend stage."
    );

    form.reset();
  }

  return (
    <footer className="oniriaFooter">
      <div className="oniriaFooterTop">
        <div className="oniriaFooterBrand">
          <Link href="/" className="oniriaFooterLogo">
            ONIRIA CITY
          </Link>

          <p>
            A new destination for modern living, lifestyle, investment and
            commercial opportunity in Zanzibar.
          </p>
        </div>

        <div className="oniriaFooterLinks">
          <div>
            <h3>Discover</h3>

            <Link href="/vision">Vision</Link>
            <Link href="/masterplan">Masterplan</Link>
            <Link href="/lifestyle">Lifestyle</Link>
            <Link href="/architecture">Architecture</Link>
            <Link href="/amenities">Amenities</Link>
          </div>

          <div>
            <h3>Properties</h3>

            <Link href="/properties">All properties</Link>
            <Link href="/villas">Villas</Link>
            <Link href="/residences">Residences</Link>
            <Link href="/v-avenue">V Avenue</Link>
            <Link href="/commercial">Commercial</Link>
          </div>

          <div>
            <h3>Information</h3>

            <Link href="/investment">Investment</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      <div className="oniriaFooterSubscribe">
        <div>
          <p>STAY CONNECTED</p>

          <h2>Receive updates from ONIRIA City</h2>
        </div>

        <form onSubmit={handleSubscribe}>
          <label htmlFor="footer-email" className="srOnly">
            Email address
          </label>

          <input
            id="footer-email"
            name="footerEmail"
            type="email"
            placeholder="Enter your email address"
            required
          />

          <button type="submit">Subscribe</button>
        </form>
      </div>

      <div className="oniriaFooterBottom">
        <p>© {new Date().getFullYear()} ONIRIA City. All rights reserved.</p>

        <div>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
