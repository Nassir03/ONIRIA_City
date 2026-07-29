import EditorialPage from "../components/EditorialPage";

export const metadata = {
  title: "Investment | ONIRIA City",
  description:
    "Learn about the investment opportunity offered by ONIRIA City in Fumba, Zanzibar.",
};

export default function InvestmentPage() {
  return (
    <EditorialPage
      hero={{
        eyebrow: "INVEST IN ONIRIA",
        title: "A New Opportunity in Zanzibar",
        description:
          "Own a home or property within a carefully planned destination designed for long-term value, lifestyle and growth.",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=85&w=2000&auto=format&fit=crop",
      }}
      introduction={{
        label: "A STRATEGIC DESTINATION",
        title: "An investment connected to place and potential",
        description:
          "ONIRIA City combines residential quality, lifestyle appeal and a growing Zanzibar location within one integrated development.",
      }}
      sections={[
        {
          title: "A growing Zanzibar market",
          description:
            "Zanzibar continues to attract residents, investors, businesses and visitors seeking distinctive property and lifestyle opportunities.",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1500&auto=format&fit=crop",
          points: [
            "International lifestyle appeal",
            "Strong tourism identity",
            "Growing residential demand",
            "Distinctive island location",
          ],
        },
        {
          title: "Different property opportunities",
          description:
            "ONIRIA offers villas, residences, apartments and commercial spaces for different ownership and investment goals.",
          image:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Private villas",
            "Modern residences",
            "Apartments",
            "Retail and commercial spaces",
          ],
          link: {
            label: "View property collections",
            href: "/properties",
          },
        },
        {
          title: "Long-term community value",
          description:
            "The mixed-use masterplan supports value by combining homes, services, nature, amenities and public spaces.",
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Integrated masterplan",
            "Quality amenities",
            "Connected neighbourhoods",
            "Long-term destination vision",
          ],
        },
        {
          title: "Guided purchasing journey",
          description:
            "The ONIRIA sales team will support prospective buyers through property selection, availability, payment information and next steps.",
          image:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Property consultation",
            "Availability guidance",
            "Payment-plan information",
            "Site-visit arrangements",
          ],
          link: {
            label: "Register your interest",
            href: "/inquiries",
          },
        },
      ]}
    />
  );
}