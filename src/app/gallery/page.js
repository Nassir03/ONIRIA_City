import Header from "../components/Header";
import PublicPageHero from "../components/PublicPageHero";
import FinalSalesCTA from "../components/FinalSalesCTA";
import Footer from "../components/Footer";

export const metadata = {
  title: "Gallery | ONIRIA City",
  description:
    "Explore the architecture, interiors and Zanzibar lifestyle of ONIRIA City.",
};

const galleryImages = [
  {
    title: "ONIRIA City",
    category: "THE DESTINATION",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=85&w=1500&auto=format&fit=crop",
    size: "large",
  },
  {
    title: "Private Villas",
    category: "ARCHITECTURE",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1500&auto=format&fit=crop",
    size: "normal",
  },
  {
    title: "Refined Living Spaces",
    category: "INTERIORS",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=85&w=1500&auto=format&fit=crop",
    size: "normal",
  },
  {
    title: "Private Comfort",
    category: "BEDROOMS",
    image:
      "https://images.unsplash.com/photo-1615874694520-474822394e73?q=85&w=1500&auto=format&fit=crop",
    size: "normal",
  },
  {
    title: "The Indian Ocean",
    category: "ZANZIBAR",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1500&auto=format&fit=crop",
    size: "large",
  },
  {
    title: "Evenings in Zanzibar",
    category: "SUNSET",
    image:
      "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?q=85&w=1500&auto=format&fit=crop",
    size: "normal",
  },
  {
    title: "A New Morning",
    category: "SUNRISE",
    image:
      "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=85&w=1500&auto=format&fit=crop",
    size: "normal",
  },
  {
    title: "Tropical Landscapes",
    category: "NATURE",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1500&auto=format&fit=crop",
    size: "normal",
  },
];

export default function GalleryPage() {
  return (
    <main>
      <Header />

      <PublicPageHero
        eyebrow="ONIRIA GALLERY"
        title="See the Vision Come to Life"
        description="Explore the architecture, interiors, landscape and island lifestyle that shape ONIRIA City."
        image="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=85&w=2000&auto=format&fit=crop"
      />

      <section className="galleryIntroduction" id="page-content">
        <p className="sectionLabel">DISCOVER ONIRIA</p>

        <h2>A visual journey through the destination</h2>

        <p>
          These images currently present the intended architectural and
          lifestyle direction. They should later be replaced with approved
          ONIRIA renders and photography.
        </p>
      </section>

      <section className="galleryGrid">
        {galleryImages.map((item) => (
          <article
            className={`galleryItem ${
              item.size === "large" ? "galleryItemLarge" : ""
            }`}
            key={item.title}
          >
            <div
              className="galleryItemImage"
              style={{ backgroundImage: `url("${item.image}")` }}
            >
              <div className="galleryItemOverlay" />

              <div className="galleryItemContent">
                <p>{item.category}</p>
                <h3>{item.title}</h3>
              </div>
            </div>
          </article>
        ))}
      </section>

      <FinalSalesCTA />
      <Footer />
    </main>
  );
}