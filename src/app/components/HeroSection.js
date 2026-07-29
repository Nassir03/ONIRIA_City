"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    image: "/media/oniria/residence-roundabout.png",
    position: "center",
  },
  {
    image: "/media/oniria/villa-pool-rear.png",
    position: "center",
  },
  {
    image: "/media/oniria/residence-aerial-masterplan.png",
    position: "center",
  },
];

const filters = [
  {
    id: "type",
    label: "Property Type",
    defaultValue: "all",
    options: [
      { label: "All Types", value: "all" },
      { label: "Villa", value: "villa" },
      { label: "Residence", value: "residence" },
      { label: "Commercial Space", value: "commercial" },
    ],
  },
  {
    id: "bedrooms",
    label: "Bedrooms",
    defaultValue: "any",
    options: [
      { label: "Any", value: "any" },
      { label: "One Bedroom", value: "1" },
      { label: "Two Bedrooms", value: "2" },
      { label: "Three Bedrooms", value: "3" },
      { label: "Four Bedrooms", value: "4" },
    ],
  },
  {
    id: "collection",
    label: "Collection",
    defaultValue: "all",
    options: [
      { label: "All Collections", value: "all" },
      { label: "Ocean Villas", value: "ocean-villas" },
      { label: "Non-Ocean Villas", value: "non-ocean-villas" },
      { label: "Residences", value: "residences" },
      { label: "Garden Residences", value: "garden-residences" },
      { label: "V Avenue", value: "v-avenue" },
    ],
  },
  {
    id: "view",
    label: "View",
    defaultValue: "any",
    options: [
      { label: "Any View", value: "any" },
      { label: "Ocean", value: "ocean" },
      { label: "Garden", value: "garden" },
      { label: "Community", value: "community" },
      { label: "Commercial", value: "commercial" },
    ],
  },
];

function getInitialFilters() {
  const initialValues = Object.fromEntries(
    filters.map((filter) => [filter.id, filter.defaultValue])
  );

  if (typeof window === "undefined") {
    return initialValues;
  }

  const query = new URLSearchParams(window.location.search);
  filters.forEach((filter) => {
    const value = query.get(filter.id);
    if (value && filter.options.some((option) => option.value === value)) {
      initialValues[filter.id] = value;
    }
  });

  return initialValues;
}

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(getInitialFilters);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const slider = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === slides.length - 1 ? 0 : previousSlide + 1
      );
    }, 8000);

    return () => clearInterval(slider);
  }, [isPaused]);

  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const selectedLabels = useMemo(() => {
    return Object.fromEntries(
      filters.map((filter) => {
        const selected = filter.options.find(
          (option) => option.value === filterValues[filter.id]
        );
        return [filter.id, selected?.label || filter.options[0].label];
      })
    );
  }, [filterValues]);

  function updateFilter(filterId, value) {
    setFilterValues((currentValues) => ({
      ...currentValues,
      [filterId]: value,
    }));
  }

  function clearFilters() {
    setFilterValues(
      Object.fromEntries(filters.map((filter) => [filter.id, filter.defaultValue]))
    );
  }

  function goToPreviousSlide() {
    setIsPaused(true);
    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? slides.length - 1 : previousSlide - 1
    );
  }

  function goToNextSlide() {
    setIsPaused(true);
    setCurrentSlide((previousSlide) =>
      previousSlide === slides.length - 1 ? 0 : previousSlide + 1
    );
  }

  function handleSearch() {
    const query = new URLSearchParams();

    filters.forEach((filter) => {
      const value = filterValues[filter.id];
      if (value !== filter.defaultValue) {
        query.set(filter.id, value);
      }
    });

    const queryString = query.toString();
    router.push(queryString ? `/properties?${queryString}` : "/properties");
    setMobileFiltersOpen(false);
  }

  function renderFilterControls(context) {
    return filters.map((filter) => (
      <label className="propertySearchField" key={`${context}-${filter.id}`}>
        <span>{filter.label}</span>
        <select
          aria-label={filter.label}
          value={filterValues[filter.id]}
          onChange={(event) => updateFilter(filter.id, event.target.value)}
        >
          {filter.options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {context === "mobile" && <strong>{selectedLabels[filter.id]}</strong>}
      </label>
    ));
  }

  return (
    <section
      className="heroSlider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="heroSlides">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`heroSlide ${
              currentSlide === index ? "heroSlideActive" : ""
            }`}
            style={{
              backgroundImage: `url("${slide.image}")`,
              backgroundPosition: slide.position,
            }}
          />
        ))}
      </div>

      <div className="heroDarkOverlay" />

      <div className="heroMainContent">
        <p className="heroWelcome">Welcome To</p>
        <h1>ONIRIA CITY</h1>
        <p className="heroSignature">The Art of Living</p>
        <p className="heroLocation">Fumba, Zanzibar</p>
      </div>

      <div className="heroSlideStatus" aria-label="Current hero slide">
        {String(currentSlide + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>

      <button
        type="button"
        className="heroArrow heroArrowLeft"
        onClick={goToPreviousSlide}
        aria-label="View previous slide"
      >
        <span aria-hidden="true" />
      </button>

      <button
        type="button"
        className="heroArrow heroArrowRight"
        onClick={goToNextSlide}
        aria-label="View next slide"
      >
        <span aria-hidden="true" />
      </button>

      <form
        className="propertySearchBar"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        {renderFilterControls("desktop")}
        <button type="submit" className="propertySearchButton">
          <span className="searchButtonIcon" aria-hidden="true" />
          Search Properties
        </button>
      </form>

      <div className="mobilePropertySearch">
        <button type="button" onClick={() => setMobileFiltersOpen(true)}>
          Find Your Property
        </button>
      </div>

      <div
        className={`mobileFilterBackdrop ${
          mobileFiltersOpen ? "mobileFilterBackdropOpen" : ""
        }`}
        onClick={() => setMobileFiltersOpen(false)}
      />

      <aside
        className={`mobileFilterSheet ${
          mobileFiltersOpen ? "mobileFilterSheetOpen" : ""
        }`}
        aria-hidden={!mobileFiltersOpen}
      >
        <div className="mobileFilterSheetHeader">
          <div>
            <p>Find Your Property</p>
            <h2>Search ONIRIA City</h2>
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close property filters"
          >
            x
          </button>
        </div>

        <form
          className="mobileFilterForm"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          {renderFilterControls("mobile")}
          <div className="mobileFilterActions">
            <button type="button" onClick={clearFilters}>
              Clear Filters
            </button>
            <button type="submit">Search Properties</button>
          </div>
        </form>
      </aside>
    </section>
  );
}
