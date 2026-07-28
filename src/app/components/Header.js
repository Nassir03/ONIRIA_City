"use client";

import { useEffect, useMemo, useState } from "react";

const searchableItems = [
  {
    title: "ONIRIA Villas",
    type: "Property collection",
    href: "/villas",
    keywords: "villa private home garden family property",
  },
  {
    title: "ONIRIA Residences",
    type: "Property collection",
    href: "/residences",
    keywords: "residence apartment home property",
  },
  {
    title: "V Avenue",
    type: "Lifestyle and commercial",
    href: "/v-avenue",
    keywords: "retail dining apartment shops commercial",
  },
  {
    title: "Commercial Opportunities",
    type: "Business",
    href: "/commercial",
    keywords: "retail restaurant office business leasing",
  },
  {
    title: "Signature Four-Bedroom Villa",
    type: "Villa",
    href: "/villas/signature-villa",
    keywords: "four bedroom signature private villa",
  },
  {
    title: "Three-Bedroom Garden Villa",
    type: "Villa",
    href: "/villas/garden-villa",
    keywords: "three bedroom garden private villa",
  },
  {
    title: "Courtyard Villa",
    type: "Villa",
    href: "/villas/courtyard-villa",
    keywords: "three bedroom courtyard private villa",
  },
  {
    title: "Garden Residence",
    type: "Residence",
    href: "/residences/garden-residence",
    keywords: "three bedroom garden residence apartment",
  },
  {
    title: "Island Residence",
    type: "Residence",
    href: "/residences/island-residence",
    keywords: "two bedroom island residence apartment",
  },
  {
    title: "Studio Residence",
    type: "Residence",
    href: "/residences/studio-residence",
    keywords: "one bedroom studio residence",
  },
  {
    title: "Vision",
    type: "Discover ONIRIA",
    href: "/vision",
    keywords: "vision purpose community Zanzibar",
  },
  {
    title: "Masterplan",
    type: "Discover ONIRIA",
    href: "/masterplan",
    keywords: "masterplan city map villas residences avenue",
  },
  {
    title: "Lifestyle",
    type: "Discover ONIRIA",
    href: "/lifestyle",
    keywords: "ocean wellness nature dining community",
  },
  {
    title: "Architecture",
    type: "Design",
    href: "/architecture",
    keywords: "architecture tropical design interiors materials",
  },
  {
    title: "Amenities",
    type: "Lifestyle",
    href: "/amenities",
    keywords: "fitness pool wellness children parks",
  },
  {
    title: "Investment",
    type: "Ownership",
    href: "/investment",
    keywords: "investment buyer ownership opportunity",
  },
  {
    title: "Gallery",
    type: "Media",
    href: "/gallery",
    keywords: "images photography villas interiors Zanzibar",
  },
  {
    title: "Journal",
    type: "Stories",
    href: "/journal",
    keywords: "news stories articles development",
  },
  {
    title: "Frequently Asked Questions",
    type: "Help",
    href: "/faqs",
    keywords: "faq questions answers buying property",
  },
  {
    title: "Contact ONIRIA",
    type: "Contact",
    href: "/contact",
    keywords: "contact telephone email location help",
  },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setDrawerOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const overlayOpen = searchOpen || drawerOpen || mobileMenuOpen;
    document.body.style.overflow = overlayOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen, drawerOpen, mobileMenuOpen]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchableItems.slice(0, 6);
    }

    return searchableItems.filter((item) => {
      const searchableText =
        `${item.title} ${item.type} ${item.keywords}`.toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery]);

  function closeAllPanels() {
    setSearchOpen(false);
    setDrawerOpen(false);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="oniriaHeader">
        <a href="/" className="oniriaHeaderLogo" onClick={closeAllPanels}>
          ONIRIA CITY
        </a>

        <nav className="oniriaDesktopNav" aria-label="Main navigation">
          <a href="/vision">Vision</a>
          <a href="/masterplan">Masterplan</a>
          <a href="/lifestyle">Lifestyle</a>
          <a href="/properties">Properties</a>
          <a href="/contact">Contact</a>

          <button
            type="button"
            className="headerInquiryButton"
            onClick={() => setDrawerOpen(true)}
          >
            Inquiries
          </button>

          <button
            type="button"
            className="headerSearchButton"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <span aria-hidden="true">⌕</span>
          </button>
        </nav>

        <div className="oniriaMobileControls">
          <button
            type="button"
            className="headerSearchButton"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <span aria-hidden="true">⌕</span>
          </button>

          <button
            type="button"
            className="mobileMenuButton"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`mobileNavigation ${
          mobileMenuOpen ? "mobileNavigationOpen" : ""
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className="panelCloseButton"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>

        <nav>
          <a href="/vision" onClick={closeAllPanels}>
            Vision
          </a>
          <a href="/masterplan" onClick={closeAllPanels}>
            Masterplan
          </a>
          <a href="/lifestyle" onClick={closeAllPanels}>
            Lifestyle
          </a>
          <a href="/properties" onClick={closeAllPanels}>
            Properties
          </a>
          <a href="/architecture" onClick={closeAllPanels}>
            Architecture
          </a>
          <a href="/amenities" onClick={closeAllPanels}>
            Amenities
          </a>
          <a href="/investment" onClick={closeAllPanels}>
            Investment
          </a>
          <a href="/gallery" onClick={closeAllPanels}>
            Gallery
          </a>
          <a href="/contact" onClick={closeAllPanels}>
            Contact
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setDrawerOpen(true);
            }}
          >
            Make an inquiry
          </button>
        </nav>
      </div>

      <div
        className={`searchOverlay ${searchOpen ? "searchOverlayOpen" : ""}`}
        aria-hidden={!searchOpen}
      >
        <div className="searchOverlayTop">
          <a href="/" className="searchOverlayLogo">
            ONIRIA CITY
          </a>

          <button
            type="button"
            className="panelCloseButton"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        <div className="searchOverlayContent">
          <p className="sectionLabel">SEARCH ONIRIA CITY</p>

          <h2>What are you looking for?</h2>

          <div className="searchInputWrapper">
            <label htmlFor="site-search" className="srOnly">
              Search ONIRIA City
            </label>

            <input
              id="site-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search villas, residences, lifestyle..."
              autoFocus={searchOpen}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="searchResultsHeader">
            <span>
              {searchQuery ? "Search results" : "Popular destinations"}
            </span>

            <strong>{searchResults.length}</strong>
          </div>

          <div className="searchResults">
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <a
                  href={item.href}
                  className="searchResultItem"
                  key={`${item.href}-${item.title}`}
                  onClick={closeAllPanels}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <div>
                    <p>{item.type}</p>
                    <h3>{item.title}</h3>
                  </div>

                  <strong>→</strong>
                </a>
              ))
            ) : (
              <div className="searchEmptyState">
                <h3>No matching results</h3>
                <p>
                  Try searching for villas, residences, investment,
                  architecture or contact.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`drawerBackdrop ${drawerOpen ? "drawerBackdropOpen" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={`inquiryDrawer ${drawerOpen ? "inquiryDrawerOpen" : ""}`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className="panelCloseButton"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close inquiry panel"
        >
          ×
        </button>

        <div className="inquiryDrawerContent">
          <p className="sectionLabel">START YOUR JOURNEY</p>

          <h2>How can we help you?</h2>

          <p className="inquiryDrawerIntroduction">
            Choose an option and continue to the appropriate ONIRIA enquiry
            form.
          </p>

          <div className="inquiryDrawerOptions">
            <a href="/inquiries?type=property-information">
              <span>01</span>
              <div>
                <h3>Property information</h3>
                <p>Ask about villas, residences and apartments.</p>
              </div>
              <strong>→</strong>
            </a>

            <a href="/inquiries?type=site-visit">
              <span>02</span>
              <div>
                <h3>Arrange a site visit</h3>
                <p>Request a visit to the ONIRIA location.</p>
              </div>
              <strong>→</strong>
            </a>

            <a href="/inquiries?type=consultation">
              <span>03</span>
              <div>
                <h3>Book a consultation</h3>
                <p>Discuss ownership, investment or property selection.</p>
              </div>
              <strong>→</strong>
            </a>

            <a href="/inquiries?type=commercial">
              <span>04</span>
              <div>
                <h3>Commercial opportunity</h3>
                <p>Explore retail, dining and office spaces.</p>
              </div>
              <strong>→</strong>
            </a>
          </div>

          <div className="inquiryDrawerContact">
            <p>Prefer a direct conversation?</p>

            <a
              href="https://wa.me/255000000000?text=Hello%20ONIRIA%20City%2C%20I%20would%20like%20more%20information."
              target="_blank"
              rel="noreferrer"
            >
              Continue on WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}