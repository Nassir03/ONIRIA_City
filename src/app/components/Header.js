"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const searchableItems = [
  { title: "ONIRIA Villas", type: "Property collection", href: "/villas", keywords: "villa private home garden family property" },
  { title: "ONIRIA Residences", type: "Property collection", href: "/residences", keywords: "residence apartment home property" },
  { title: "V Avenue", type: "Lifestyle and commercial", href: "/v-avenue", keywords: "retail dining apartment shops commercial" },
  { title: "Commercial Opportunities", type: "Business", href: "/commercial", keywords: "retail restaurant office business leasing" },
  { title: "Vision", type: "Discover ONIRIA", href: "/vision", keywords: "vision purpose community Zanzibar" },
  { title: "Masterplan", type: "Discover ONIRIA", href: "/masterplan", keywords: "masterplan city map villas residences avenue" },
  { title: "Lifestyle", type: "Discover ONIRIA", href: "/lifestyle", keywords: "ocean wellness nature dining community" },
  { title: "Contact ONIRIA", type: "Contact", href: "/contact", keywords: "contact telephone email location help" },
  { title: "Frequently Asked Questions", type: "Help", href: "/faqs", keywords: "faq questions answers buying property" },
];

export default function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setDrawerOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = searchOpen || drawerOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [searchOpen, drawerOpen]);

  useEffect(() => {
    function handleScroll() {
      const threshold = isHome
        ? Math.max(420, window.innerHeight - 140)
        : 8;
      setScrolled(window.scrollY > threshold);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return searchableItems.slice(0, 6);
    }
    return searchableItems.filter((item) =>
      `${item.title} ${item.type} ${item.keywords}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  function closeAllPanels() {
    setSearchOpen(false);
    setDrawerOpen(false);
  }

  return (
    <>
      <header
        className={`oniriaHeader ${isHome ? "oniriaHeaderHome" : ""} ${
          scrolled ? "oniriaHeaderScrolled" : ""
        }`}
      >
        <Link href="/" className="oniriaHeaderLogo" onClick={closeAllPanels}>
          ONIRIA CITY
        </Link>

        <div className="oniriaMobileTopActions">
          <button type="button" className="headerSearchButton" onClick={() => setSearchOpen(true)} aria-label="Open search">
            <span aria-hidden="true" />
          </button>
          <button type="button" className="headerInquiryButton" onClick={() => setDrawerOpen(true)}>
            Inquiries
          </button>
        </div>

        <nav className="oniriaDesktopNav" aria-label="Main navigation">
          <Link href="/vision">Vision</Link>
          <Link href="/masterplan">Masterplan</Link>
          <Link href="/lifestyle">Lifestyle</Link>
          <Link href="/contact">Contact</Link>
          <button type="button" className="headerSearchButton" onClick={() => setSearchOpen(true)} aria-label="Open search">
            <span aria-hidden="true" />
          </button>
          <button type="button" className="headerInquiryButton" onClick={() => setDrawerOpen(true)}>
            Inquiries
          </button>
        </nav>

        <nav className="oniriaMobileControls" aria-label="Mobile navigation">
          <Link href="/vision">Vision</Link>
          <Link href="/masterplan">Masterplan</Link>
          <Link href="/lifestyle">Lifestyle</Link>
          <Link href="/contact">Contact</Link>
          <button type="button" className="headerSearchButton" onClick={() => setSearchOpen(true)} aria-label="Open search">
            <span aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setDrawerOpen(true)}>Inquiries</button>
        </nav>
      </header>

      <div className={`searchOverlay ${searchOpen ? "searchOverlayOpen" : ""}`} aria-hidden={!searchOpen}>
        <div className="searchOverlayTop">
          <Link href="/" className="searchOverlayLogo">ONIRIA CITY</Link>
          <button type="button" className="panelCloseButton" onClick={() => setSearchOpen(false)} aria-label="Close search">
            x
          </button>
        </div>

        <div className="searchOverlayContent">
          <p className="sectionLabel">SEARCH ONIRIA CITY</p>
          <h2>What are you looking for?</h2>

          <div className="searchInputWrapper">
            <label htmlFor="site-search" className="srOnly">Search ONIRIA City</label>
            <input
              id="site-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search villas, residences, lifestyle..."
              autoFocus={searchOpen}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">
                Clear
              </button>
            )}
          </div>

          <div className="searchResultsHeader">
            <span>{searchQuery ? "Search results" : "Popular destinations"}</span>
            <strong>{searchResults.length}</strong>
          </div>

          <div className="searchResults">
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <Link href={item.href} className="searchResultItem" key={`${item.href}-${item.title}`} onClick={closeAllPanels}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{item.type}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <strong>-&gt;</strong>
                </Link>
              ))
            ) : (
              <div className="searchEmptyState">
                <h3>No matching results</h3>
                <p>Try searching for villas, residences, investment, architecture or contact.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`drawerBackdrop ${drawerOpen ? "drawerBackdropOpen" : ""}`} onClick={() => setDrawerOpen(false)} />

      <aside className={`inquiryDrawer ${drawerOpen ? "inquiryDrawerOpen" : ""}`} aria-hidden={!drawerOpen}>
        <button type="button" className="panelCloseButton" onClick={() => setDrawerOpen(false)} aria-label="Close inquiry panel">
          x
        </button>

        <div className="inquiryDrawerContent">
          <p className="sectionLabel">START YOUR JOURNEY</p>
          <h2>How can we help you?</h2>
          <p className="inquiryDrawerIntroduction">
            Choose an option and continue to the appropriate ONIRIA enquiry form.
          </p>

          <div className="inquiryDrawerOptions">
            <Link href="/inquiries?type=property-information"><span>01</span><div><h3>Property information</h3><p>Ask about villas, residences and apartments.</p></div><strong>-&gt;</strong></Link>
            <Link href="/inquiries?type=site-visit"><span>02</span><div><h3>Arrange a site visit</h3><p>Request a visit to the ONIRIA location.</p></div><strong>-&gt;</strong></Link>
            <Link href="/inquiries?type=consultation"><span>03</span><div><h3>Book a consultation</h3><p>Discuss ownership, investment or property selection.</p></div><strong>-&gt;</strong></Link>
            <Link href="/inquiries?type=commercial"><span>04</span><div><h3>Commercial opportunity</h3><p>Explore retail, dining and office spaces.</p></div><strong>-&gt;</strong></Link>
          </div>

          <div className="inquiryDrawerContact">
            <p>Prefer a direct conversation?</p>
            <a href="https://wa.me/255000000000?text=Hello%20ONIRIA%20City%2C%20I%20would%20like%20more%20information." target="_blank" rel="noreferrer">
              Continue on WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
