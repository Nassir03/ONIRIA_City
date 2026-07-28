const collections = [
  {
    title: "ONIRIA Villas",
    category: "PRIVATE LIVING",
    description:
      "Elegant private villas designed for comfort, privacy and modern island living.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    link: "/villas",
  },
  {
    title: "ONIRIA Residences",
    category: "MODERN RESIDENCES",
    description:
      "Contemporary homes combining thoughtful design, natural light and community.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
    link: "/residences",
  },
  {
    title: "V Avenue",
    category: "LIFESTYLE & BUSINESS",
    description:
      "A vibrant destination for shops, restaurants, services and everyday experiences.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    link: "/v-avenue",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="collectionsSection">
      <div className="collectionsHeading">
        <p className="sectionLabel">DISCOVER ONIRIA</p>

        <h2>Featured Collections</h2>

        <p>
          Explore the different spaces that come together to create the ONIRIA
          City experience.
        </p>
      </div>

      <div className="collectionsGrid">
        {collections.map((collection) => (
          <article className="collectionCard" key={collection.title}>
            <div
              className="collectionImage"
              style={{
                backgroundImage: `url("${collection.image}")`,
              }}
            >
              <div className="collectionOverlay"></div>

              <div className="collectionContent">
                <p>{collection.category}</p>

                <h3>{collection.title}</h3>

                <span>Explore →</span>
              </div>

              <a
                href={collection.link}
                className="collectionFullLink"
                aria-label={`Explore ${collection.title}`}
              ></a>
            </div>

            <p className="collectionDescription">
              {collection.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}