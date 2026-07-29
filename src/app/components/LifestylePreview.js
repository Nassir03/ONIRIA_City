const lifestyleItems = [
  {
    title: "Ocean Living",
    description:
      "Enjoy the calm rhythm of Zanzibar with refreshing sea views, coastal experiences and beautiful sunsets.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1400&auto=format&fit=crop",
  },
  {
    title: "Wellness and Nature",
    description:
      "Walk through landscaped spaces, relax in peaceful surroundings and reconnect with nature every day.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1400&auto=format&fit=crop",
  },
  {
    title: "Community and Belonging",
    description:
      "Shared spaces, family-friendly areas and social destinations create a welcoming place for every generation.",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=85&w=1400&auto=format&fit=crop",
  },
];

export default function LifestylePreview() {
  return (
    <section className="lifestylePreviewSection" id="lifestyle">
      <div className="lifestylePreviewHeading">
        <div>
          <p className="sectionLabel">THE ONIRIA LIFESTYLE</p>

          <h2>Inspired by the beauty and spirit of Zanzibar</h2>
        </div>

        <div className="lifestylePreviewIntro">
          <p>
            ONIRIA City combines modern living with the experiences that make
            Zanzibar special: the ocean, tropical landscapes, wellness,
            community and a relaxed way of life.
          </p>

          <a href="/lifestyle" className="textLink">
            Explore the lifestyle →
          </a>
        </div>
      </div>

      <div className="lifestylePreviewHero">
        <div
          className="lifestylePreviewHeroImage"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?q=85&w=2000&auto=format&fit=crop')",
          }}
        >
          <div className="lifestylePreviewHeroOverlay" />

          <div className="lifestylePreviewHeroContent">
            <p>ISLAND LIVING, REIMAGINED</p>

            <h3>More than a home. A complete way of life.</h3>

            <span>
              Live close to the sea, nature, community spaces and everyday
              experiences designed for comfort and belonging.
            </span>

            <a href="/lifestyle" className="lifestylePreviewButton">
              Discover ONIRIA Lifestyle
            </a>
          </div>
        </div>
      </div>

      <div className="lifestylePreviewGrid">
        {lifestyleItems.map((item) => (
          <article className="lifestylePreviewCard" key={item.title}>
            <div
              className="lifestylePreviewCardImage"
              style={{
                backgroundImage: `url("${item.image}")`,
              }}
            >
              <div className="lifestylePreviewCardOverlay" />
            </div>

            <div className="lifestylePreviewCardContent">
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <a href="/lifestyle">
                Discover more <span>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}