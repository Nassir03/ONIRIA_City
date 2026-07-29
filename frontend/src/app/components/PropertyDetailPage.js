import Header from "./Header";
import FinalSalesCTA from "./FinalSalesCTA";
import Footer from "./Footer";

export default function PropertyDetailPage({ property }) {
  return (
    <main>
      <Header />

      <section
        className="propertyDetailHero"
        style={{
          backgroundImage: `url("${property.heroImage}")`,
        }}
      >
        <div className="propertyDetailHeroOverlay" />

        <div className="propertyDetailHeroContent">
          <p>{property.collection}</p>

          <h1>{property.title}</h1>

          <span>{property.location}</span>
        </div>

        <a href="#property-overview" className="propertyDetailScroll">
          Explore ↓
        </a>
      </section>

      <section className="propertyDetailOverview" id="property-overview">
        <div className="propertyDetailOverviewText">
          <p className="sectionLabel">{property.eyebrow}</p>

          <h2>{property.overviewTitle}</h2>

          <p>{property.description}</p>
        </div>

        <div className="propertyDetailFacts">
          {property.facts.map((fact) => (
            <div key={fact.label}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="propertyDetailGallery">
        {property.gallery.map((image, index) => (
          <article
            className={`propertyDetailGalleryItem ${
              index === 0 ? "propertyDetailGalleryItemLarge" : ""
            }`}
            key={image.title}
          >
            <div
              className="propertyDetailGalleryImage"
              style={{
                backgroundImage: `url("${image.url}")`,
              }}
            >
              <div className="propertyDetailGalleryOverlay" />

              <div className="propertyDetailGalleryCaption">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{image.title}</h3>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="propertyDetailFeaturesSection">
        <div className="propertyDetailFeaturesHeading">
          <p className="sectionLabel">PROPERTY FEATURES</p>

          <h2>Designed around comfort and island living</h2>
        </div>

        <div className="propertyDetailFeaturesGrid">
          {property.features.map((feature, index) => (
            <article key={feature.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="propertyDetailLayout">
        <div
          className="propertyDetailLayoutImage"
          style={{
            backgroundImage: `url("${property.layoutImage}")`,
          }}
        />

        <div className="propertyDetailLayoutContent">
          <p className="sectionLabel">LAYOUT & SPACES</p>

          <h2>{property.layoutTitle}</h2>

          <p>{property.layoutDescription}</p>

          <ul>
            {property.layoutPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <a href="/inquiries" className="propertyDetailPrimaryButton">
            Request full details
          </a>
        </div>
      </section>

      <section className="propertyDetailInquiry">
        <div>
          <p className="sectionLabel">REGISTER YOUR INTEREST</p>

          <h2>Take the next step toward owning at ONIRIA City</h2>
        </div>

        <div className="propertyDetailInquiryActions">
          <a href="/inquiries" className="propertyDetailPrimaryButton">
            Make an inquiry
          </a>

          <a href="/contact" className="propertyDetailSecondaryButton">
            Speak to our team
          </a>
        </div>
      </section>

      <FinalSalesCTA />
      <Footer />
    </main>
  );
}