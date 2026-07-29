import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "V Avenue | ONIRIA City",
  description:
    "Explore apartments, retail, restaurants and professional spaces at V Avenue in ONIRIA City.",
};

const opportunities = [
  {
    title: "V Avenue Two-Bedroom Apartment",
    category: "Mixed-use apartment",
    description:
      "A contemporary apartment positioned close to dining, retail, services and community activity.",
    image:
      "/media/oniria/residence-parking-garden.png",
    href: "/v-avenue/apartment",
  },
  {
    title: "V Avenue Retail Space",
    category: "Commercial opportunity",
    description:
      "A flexible retail opportunity for businesses seeking visibility within a growing residential community.",
    image:
      "/media/oniria/residence-roundabout.png",
    href: "/commercial/retail-space",
  },
  {
    title: "Restaurant and Café Space",
    category: "Dining opportunity",
    description:
      "A hospitality space intended for cafés, restaurants and selected dining concepts.",
    image:
      "/media/oniria/residence-aerial-masterplan.png",
    href: "/commercial/restaurant-space",
  },
  {
    title: "Professional Office Space",
    category: "Office opportunity",
    description:
      "A modern business address for companies and professional service providers.",
    image:
      "/media/oniria/v-avenue-commercial.png",
    href: "/commercial/office-space",
  },
];

export default function VAvenuePage() {
  return (
    <main>
      <Header />

      <section
        className="propertyCollectionHero"
        style={{
          backgroundImage:
            'url("/media/oniria/villa-pool-rear.png")',
        }}
      >
        <div className="propertyCollectionHeroOverlay" />

        <div className="propertyCollectionHeroContent">
          <p>V AVENUE</p>

          <h1>The social and commercial heart of ONIRIA City</h1>

          <span>Living · Dining · Retail · Business</span>
        </div>
      </section>

      <section className="propertyCollectionIntroduction">
        <div>
          <p className="sectionLabel">DISCOVER V AVENUE</p>

          <h2>A vibrant destination for living, working and gathering</h2>
        </div>

        <p>
          V Avenue is designed as a mixed-use centre where residents, visitors
          and businesses can connect. It brings together homes, shops, cafés,
          restaurants, offices and public spaces within an active and walkable
          environment.
        </p>
      </section>

      <section className="propertyCollectionGridSection">
        <div className="propertyCollectionGridHeading">
          <p className="sectionLabel">EXPLORE THE COLLECTION</p>

          <h2>Opportunities within V Avenue</h2>
        </div>

        <div className="propertyCollectionGrid">
          {opportunities.map((item, index) => (
            <article className="propertyCollectionCard" key={item.href}>
              <a href={item.href}>
                <div
                  className="propertyCollectionCardImage"
                  style={{
                    backgroundImage: `url("${item.image}")`,
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="propertyCollectionCardContent">
                  <p>{item.category}</p>

                  <h3>{item.title}</h3>

                  <div className="propertyCollectionCardDescription">
                    {item.description}
                  </div>

                  <span className="propertyCollectionCardLink">
                    Explore opportunity →
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="propertyCollectionClosing">
        <div>
          <p className="sectionLabel">REGISTER YOUR INTEREST</p>

          <h2>Find your place within V Avenue</h2>
        </div>

        <a
          href="/inquiries?type=property-information&collection=v-avenue"
          className="propertyDetailPrimaryButton"
        >
          Make an inquiry
        </a>
      </section>

      <Footer />
    </main>
  );
}