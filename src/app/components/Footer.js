"use client";

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
          <a href="/" className="oniriaFooterLogo">
            ONIRIA CITY
          </a>

          <p>
            A new destination for modern living, lifestyle, investment and
            commercial opportunity in Zanzibar.
          </p>
        </div>

        <div className="oniriaFooterLinks">
          <div>
            <h3>Discover</h3>

            <a href="/vision">Vision</a>
            <a href="/masterplan">Masterplan</a>
            <a href="/lifestyle">Lifestyle</a>
            <a href="/architecture">Architecture</a>
            <a href="/amenities">Amenities</a>
          </div>

          <div>
            <h3>Properties</h3>

            <a href="/properties">All properties</a>
            <a href="/villas">Villas</a>
            <a href="/residences">Residences</a>
            <a href="/v-avenue">V Avenue</a>
            <a href="/commercial">Commercial</a>
          </div>

          <div>
            <h3>Information</h3>

            <a href="/investment">Investment</a>
            <a href="/gallery">Gallery</a>
            <a href="/journal">Journal</a>
            <a href="/faqs">FAQs</a>
            <a href="/contact">Contact</a>
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
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms and Conditions</a>
        </div>
      </div>
    </footer>
  );
}