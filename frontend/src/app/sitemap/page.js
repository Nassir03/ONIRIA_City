import Header from "../components/Header";
import PublicPageHero from "../components/PublicPageHero";
import Footer from "../components/Footer";

export const metadata = {
  title: "Sitemap | ONIRIA City",
};

const groups = [
  {
    title: "Discover",
    links: [["Vision", "/vision"], ["Architecture", "/architecture"], ["Amenities", "/amenities"], ["Lifestyle", "/lifestyle"], ["Masterplan", "/masterplan"], ["Gallery", "/gallery"], ["Journal", "/journal"]],
  },
  {
    title: "Properties",
    links: [["All Properties", "/properties"], ["Villas", "/villas"], ["Residences", "/residences"], ["Signature Villa", "/villas/signature-villa"], ["V Avenue", "/v-avenue"], ["Commercial", "/commercial"]],
  },
  {
    title: "Sales",
    links: [["Register Interest", "/inquiries"], ["Request Brochure", "/inquiries?type=brochure"], ["Book Consultation", "/inquiries?type=consultation"], ["Arrange Site Visit", "/inquiries?type=site-visit"], ["Contact", "/contact"]],
  },
  {
    title: "Resources",
    links: [["Investment", "/investment"], ["FAQs", "/faqs"], ["Properties in Fumba", "/properties?location=fumba"], ["V Avenue Commercial Spaces", "/commercial"]],
  },
  {
    title: "Legal",
    links: [["Privacy Policy", "/privacy"], ["Terms and Conditions", "/terms"], ["Cookie Policy", "/cookie-policy"], ["Accessibility", "/accessibility"]],
  },
];

export default function SitemapPage() {
  return (
    <main>
      <Header />
      <PublicPageHero
        eyebrow="SITE MAP"
        title="Find Your Way Around ONIRIA City"
        description="Explore public pages, property collections, resources and legal information."
        image="/media/oniria/residence-aerial-masterplan.png"
      />
      <section className="sitemapSection" id="page-content">
        {groups.map((group) => (
          <article key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.links.map(([label, href]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
