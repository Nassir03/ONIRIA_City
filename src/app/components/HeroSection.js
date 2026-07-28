"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "WELCOME TO ONIRIA CITY",
    title: "A New Destination in Fumba",
    subtitle:
      "A thoughtfully planned Zanzibar community bringing together beautiful homes, tropical landscapes and modern island living.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "ONIRIA VILLAS",
    title: "Contemporary Homes Inspired by Zanzibar",
    subtitle:
      "Private villas designed with generous spaces, natural materials, tropical gardens and a strong connection to the outdoors.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "ELEGANT INTERIORS",
    title: "Rooms Designed for Modern Living",
    subtitle:
      "Bright living spaces, refined finishes and comfortable interiors created for families, residents and international buyers.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1615874694520-474822394e73?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "PRIVATE COMFORT",
    title: "Peaceful Bedrooms and Refined Details",
    subtitle:
      "Relax in calm private rooms shaped by natural light, warm textures and the peaceful character of island living.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "THE INDIAN OCEAN",
    title: "Live Close to Zanzibar’s Turquoise Sea",
    subtitle:
      "Enjoy refreshing ocean views, coastal experiences and the relaxed rhythm of island life from ONIRIA City.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "ZANZIBAR SUNSET",
    title: "Evenings Painted in Gold",
    subtitle:
      "Experience unforgettable sunsets where warm skies meet the Indian Ocean and every evening feels extraordinary.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=85&w=2000&auto=format&fit=crop",
    eyebrow: "A NEW MORNING",
    title: "Wake Up to the Beauty of Sunrise",
    subtitle:
      "Begin each day with soft morning light, peaceful surroundings and the promise of a better way of living.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [collection, setCollection] = useState("");

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === slides.length - 1 ? 0 : previousSlide + 1
      );
    }, 6000);

    return () => clearInterval(slider);
  }, []);

  function goToPreviousSlide() {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? slides.length - 1 : previousSlide - 1
    );
  }

  function goToNextSlide() {
    setCurrentSlide((previousSlide) =>
      previousSlide === slides.length - 1 ? 0 : previousSlide + 1
    );
  }

  function goToSlide(index) {
    setCurrentSlide(index);
  }

  function handleSearch(event) {
    event.preventDefault();

    const searchParameters = new URLSearchParams();

    if (propertyType) {
      searchParameters.set("type", propertyType);
    }

    if (bedrooms) {
      searchParameters.set("bedrooms", bedrooms);
    }

    if (priceRange) {
      searchParameters.set("price", priceRange);
    }

    if (collection) {
      searchParameters.set("collection", collection);
    }

    const queryString = searchParameters.toString();

    window.location.href = queryString
      ? `/properties?${queryString}`
      : "/properties";
  }

  const activeSlide = slides[currentSlide];

  return (
    <section className="heroSlider">
      <div className="heroSlides">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`heroSlide ${
              currentSlide === index ? "heroSlideActive" : ""
            }`}
            style={{
              backgroundImage: `url("${slide.image}")`,
            }}
          />
        ))}
      </div>

      <div className="heroDarkOverlay" />

      <div className="heroMainContent">
        <p className="heroEyebrow">{activeSlide.eyebrow}</p>

        <h1>{activeSlide.title}</h1>

        <p className="heroDescription">{activeSlide.subtitle}</p>

        <div className="heroActions">
          <a href="#introduction" className="heroPrimaryButton">
            Discover ONIRIA
          </a>

          <a href="/masterplan" className="heroSecondaryButton">
            Explore Masterplan
          </a>
        </div>
      </div>

      <button
        type="button"
        className="heroArrow heroArrowLeft"
        onClick={goToPreviousSlide}
        aria-label="View previous slide"
      >
        ←
      </button>

      <button
        type="button"
        className="heroArrow heroArrowRight"
        onClick={goToNextSlide}
        aria-label="View next slide"
      >
        →
      </button>

      <div className="heroIndicators">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.title}
            className={`heroIndicator ${
              currentSlide === index ? "heroIndicatorActive" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`View slide ${index + 1}: ${slide.title}`}
          />
        ))}
      </div>

      <form className="propertySearchBar" onSubmit={handleSearch}>
        <div className="propertySearchField">
          <label htmlFor="property-type">Property type</label>

          <select
            id="property-type"
            value={propertyType}
            onChange={(event) => setPropertyType(event.target.value)}
          >
            <option value="">All properties</option>
            <option value="villa">Villa</option>
            <option value="residence">Residence</option>
            <option value="apartment">Apartment</option>
            <option value="commercial">Commercial space</option>
          </select>
        </div>

        <div className="propertySearchField">
          <label htmlFor="bedrooms">Bedrooms</label>

          <select
            id="bedrooms"
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
          >
            <option value="">Any bedrooms</option>
            <option value="1">1 bedroom</option>
            <option value="2">2 bedrooms</option>
            <option value="3">3 bedrooms</option>
            <option value="4">4 bedrooms</option>
            <option value="5">5+ bedrooms</option>
          </select>
        </div>

        <div className="propertySearchField">
          <label htmlFor="price-range">Price range</label>

          <select
            id="price-range"
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
          >
            <option value="">Any price</option>
            <option value="entry">Entry collection</option>
            <option value="premium">Premium collection</option>
            <option value="signature">Signature collection</option>
          </select>
        </div>

        <div className="propertySearchField">
          <label htmlFor="collection">Community</label>

          <select
            id="collection"
            value={collection}
            onChange={(event) => setCollection(event.target.value)}
          >
            <option value="">All communities</option>
            <option value="oniria-villas">ONIRIA Villas</option>
            <option value="oniria-residences">ONIRIA Residences</option>
            <option value="v-avenue">V Avenue</option>
          </select>
        </div>

        <button type="submit" className="propertySearchButton">
          Search properties
        </button>
      </form>

      <a
        href="#introduction"
        className="heroScrollArrow"
        aria-label="Scroll to introduction"
      >
        ↓
      </a>
    </section>
  );
}