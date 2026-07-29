const masterplanHighlights = [
  {
    number: "01",
    title: "ONIRIA Villas",
    description:
      "Private homes with generous indoor spaces, gardens and a strong connection to Zanzibar’s tropical surroundings.",
  },
  {
    number: "02",
    title: "ONIRIA Residences",
    description:
      "Modern apartments and residences designed for comfort, natural light and convenient community living.",
  },
  {
    number: "03",
    title: "V Avenue",
    description:
      "A lively commercial destination bringing together shops, cafés, restaurants, services and social spaces.",
  },
  {
    number: "04",
    title: "Green Community",
    description:
      "Landscaped walking routes, gardens, wellness areas and shared spaces connect every part of the development.",
  },
];

export default function MasterplanPreview() {
  return (
    <section className="masterplanSection" id="masterplan">
      <div className="masterplanHeading">
        <div>
          <p className="sectionLabel">THE MASTERPLAN</p>

          <h2>A complete destination designed around life</h2>
        </div>

        <div className="masterplanHeadingText">
          <p>
            ONIRIA City brings homes, business, nature and community together
            in one carefully planned destination in Fumba, Zanzibar.
          </p>

          <a href="/masterplan" className="textLink">
            Explore the full masterplan →
          </a>
        </div>
      </div>

      <div className="masterplanVisual">
        <div
          className="masterplanImage"
          style={{
            backgroundImage:
              "url('/media/oniria/residence-roundabout.png')",
          }}
        >
          <div className="masterplanImageOverlay" />

          <div className="masterplanImageContent">
            <p>ONIRIA CITY · FUMBA, ZANZIBAR</p>

            <h3>One vision. Many ways to live.</h3>

            <span>
              A connected community of villas, residences, commercial spaces,
              landscaped areas and shared experiences.
            </span>

            <a href="/masterplan" className="masterplanButton">
              View masterplan
            </a>
          </div>

          <div className="masterplanMapLabel masterplanMapLabelOne">
            <span>01</span>
            ONIRIA Villas
          </div>

          <div className="masterplanMapLabel masterplanMapLabelTwo">
            <span>02</span>
            Residences
          </div>

          <div className="masterplanMapLabel masterplanMapLabelThree">
            <span>03</span>
            V Avenue
          </div>

          <div className="masterplanMapLabel masterplanMapLabelFour">
            <span>04</span>
            Community Park
          </div>
        </div>
      </div>

      <div className="masterplanHighlights">
        {masterplanHighlights.map((highlight) => (
          <article
            className="masterplanHighlightCard"
            key={highlight.number}
          >
            <span className="masterplanHighlightNumber">
              {highlight.number}
            </span>

            <h3>{highlight.title}</h3>

            <p>{highlight.description}</p>

            <a href="/masterplan">
              Discover <span>→</span>
            </a>
          </article>
        ))}
      </div>

    </section>
  );
}
