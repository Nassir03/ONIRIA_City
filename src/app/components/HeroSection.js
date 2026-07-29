"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "/media/oniria/villa-pool-rear.png",
    eyebrow: "WELCOME TO ONIRIA CITY",
    title: "A New Destination in Fumba",
    subtitle:
      "A thoughtfully planned Zanzibar community bringing together beautiful homes, tropical landscapes and modern island living.",
  },
  {
    image:
      "/media/oniria/villa-front-entry.png",
    eyebrow: "ONIRIA VILLAS",
    title: "Contemporary Homes Inspired by Zanzibar",
    subtitle:
      "Private villas designed with generous spaces, natural materials, tropical gardens and a strong connection to the outdoors.",
  },
  {
    image:
      "/media/oniria/villa-gated-entry.png",
    eyebrow: "PRIVATE VILLAS",
    title: "A Gated Arrival Framed by Greenery",
    subtitle:
      "Bright living spaces, refined finishes and comfortable interiors created for families, residents and international buyers.",
  },
  {
    image:
      "/media/oniria/residence-parking-garden.png",
    eyebrow: "ONIRIA RESIDENCES",
    title: "Modern Residences in a Garden Setting",
    subtitle:
      "Relax in calm private rooms shaped by natural light, warm textures and the peaceful character of island living.",
  },
  {
    image:
      "/media/oniria/residence-roundabout.png",
    eyebrow: "CONNECTED COMMUNITY",
    title: "Palm-Lined Streets and Shared Landscapes",
    subtitle:
      "Enjoy refreshing ocean views, coastal experiences and the relaxed rhythm of island life from ONIRIA City.",
  },
  {
    image:
      "/media/oniria/residence-aerial-masterplan.png",
    eyebrow: "MASTERPLAN VIEW",
    title: "A Residential Plan Built Around Landscape",
    subtitle:
      "Experience unforgettable sunsets where warm skies meet the Indian Ocean and every evening feels extraordinary.",
  },
  {
    image:
      "/media/oniria/v-avenue-commercial.png",
    eyebrow: "V AVENUE",
    title: "A Commercial Frontage for Everyday Life",
    subtitle:
      "Begin each day with soft morning light, peaceful surroundings and the promise of a better way of living.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
