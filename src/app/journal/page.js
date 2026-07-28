import Header from "../components/Header";
import PublicPageHero from "../components/PublicPageHero";
import FinalSalesCTA from "../components/FinalSalesCTA";
import Footer from "../components/Footer";

export const metadata = {
  title: "Journal | ONIRIA City",
  description:
    "Read stories about ONIRIA City, architecture, lifestyle and Zanzibar.",
};

const articles = [
  {
    category: "ONIRIA CITY",
    date: "Coming soon",
    title: "Introducing a New Way of Living in Fumba",
    description:
      "Discover the vision behind a connected residential and lifestyle destination shaped by Zanzibar.",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=85&w=1400&auto=format&fit=crop",
    slug: "introducing-oniria-city",
  },
  {
    category: "ARCHITECTURE",
    date: "Coming soon",
    title: "Designing Contemporary Homes for a Tropical Climate",
    description:
      "Explore how light, airflow, shade and natural materials influence ONIRIA’s architectural direction.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1400&auto=format&fit=crop",
    slug: "tropical-architecture",
  },
  {
    category: "LIFESTYLE",
    date: "Coming soon",
    title: "Why Zanzibar Continues to Inspire the World",
    description:
      "Ocean experiences, culture, nature and warm hospitality make Zanzibar a distinctive place to live.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1400&auto=format&fit=crop",
    slug: "zanzibar-lifestyle",
  },
  {
    category: "INVESTMENT",
    date: "Coming soon",
    title: "Understanding the ONIRIA Property Collections",
    description:
      "Learn about the villas, residences, apartments and commercial opportunities planned for the community.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=85&w=1400&auto=format&fit=crop",
    slug: "property-collections",
  },
  {
    category: "MASTERPLAN",
    date: "Coming soon",
    title: "Building a Walkable and Connected Community",
    description:
      "See how homes, public spaces, nature and everyday services can work together within one destination.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1400&auto=format&fit=crop",
    slug: "connected-community",
  },
  {
    category: "WELLNESS",
    date: "Coming soon",
    title: "Creating Space for Health, Nature and Belonging",
    description:
      "ONIRIA’s lifestyle vision includes wellness, landscaped spaces and opportunities for social connection.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=85&w=1400&auto=format&fit=crop",
    slug: "wellness-and-belonging",
  },
];

export default function JournalPage() {
  return (
    <main>
      <Header />

      <PublicPageHero
        eyebrow="THE ONIRIA JOURNAL"
        title="Stories from ONIRIA City"
        description="Architecture, lifestyle, investment and stories inspired by Zanzibar."
        image="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=85&w=2000&auto=format&fit=crop"
      />

      <section className="journalIntroduction" id="page-content">
        <p className="sectionLabel">NEWS & STORIES</p>

        <h2>Ideas shaping the ONIRIA experience</h2>

        <p>
          Follow the development journey and explore stories about design,
          community, island living and investment in Zanzibar.
        </p>
      </section>

      <section className="journalGrid">
        {articles.map((article) => (
          <article className="journalCard" key={article.slug}>
            <a href={`/journal/${article.slug}`} className="journalImageLink">
              <div
                className="journalImage"
                style={{ backgroundImage: `url("${article.image}")` }}
              >
                <div className="journalImageOverlay" />
                <span>Read story →</span>
              </div>
            </a>

            <div className="journalCardContent">
              <div className="journalMeta">
                <span>{article.category}</span>
                <span>{article.date}</span>
              </div>

              <h2>{article.title}</h2>

              <p>{article.description}</p>

              <a href={`/journal/${article.slug}`} className="textLink">
                Read article →
              </a>
            </div>
          </article>
        ))}
      </section>

      <FinalSalesCTA />
      <Footer />
    </main>
  );
}