import PropertyCollectionPage from "../components/PropertyCollectionPage";

export const metadata = {
  title: "Properties | ONIRIA City",
  description:
    "Explore villas, residences, apartments and commercial spaces at ONIRIA City.",
};

const properties = [
  {
    title: "Signature Four-Bedroom Villa",
    collection: "ONIRIA VILLAS",
    location: "Fumba, Zanzibar",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1500&auto=format&fit=crop",
    bedrooms: "4 bedrooms",
    bathrooms: "4 bathrooms",
    area: "320 m²",
    priceLabel: "Availability",
    price: "Register interest",
    status: "Featured",
    description:
      "A spacious private villa with tropical gardens, refined interiors and generous family living areas.",
    link: "/villas/signature-villa",
  },
  {
    title: "Three-Bedroom Garden Villa",
    collection: "ONIRIA VILLAS",
    location: "Fumba, Zanzibar",
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?q=85&w=1500&auto=format&fit=crop",
    bedrooms: "3 bedrooms",
    bathrooms: "3 bathrooms",
    area: "245 m²",
    priceLabel: "Availability",
    price: "Register interest",
    description:
      "A calm contemporary home arranged around garden views, natural light and private outdoor living.",
    link: "/villas/garden-villa",
  },
  {
    title: "Three-Bedroom Garden Residence",
    collection: "ONIRIA RESIDENCES",
    location: "Fumba, Zanzibar",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=85&w=1500&auto=format&fit=crop",
    bedrooms: "3 bedrooms",
    bathrooms: "3 bathrooms",
    area: "210 m²",
    priceLabel: "Availability",
    price: "Register interest",
    status: "New",
    description:
      "A refined residence with open-plan living, landscaped views and generous private spaces.",
    link: "/residences/garden-residence",
  },
  {
    title: "Two-Bedroom Island Residence",
    collection: "ONIRIA RESIDENCES",
    location: "Fumba, Zanzibar",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=85&w=1500&auto=format&fit=crop",
    bedrooms: "2 bedrooms",
    bathrooms: "2 bathrooms",
    area: "145 m²",
    priceLabel: "Availability",
    price: "Register interest",
    description:
      "A modern residence created for comfortable island living, investment and flexible use.",
    link: "/residences/island-residence",
  },
  {
    title: "V Avenue Apartment",
    collection: "V AVENUE",
    location: "Fumba, Zanzibar",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=85&w=1500&auto=format&fit=crop",
    bedrooms: "2 bedrooms",
    bathrooms: "2 bathrooms",
    area: "130 m²",
    priceLabel: "Availability",
    price: "Register interest",
    description:
      "A connected apartment close to dining, retail, services and the social heart of ONIRIA City.",
    link: "/v-avenue/apartment",
  },
  {
    title: "V Avenue Retail Space",
    collection: "COMMERCIAL",
    location: "Fumba, Zanzibar",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=85&w=1500&auto=format&fit=crop",
    area: "Flexible layouts",
    priceLabel: "Leasing",
    price: "Enquire now",
    description:
      "A flexible retail opportunity positioned within ONIRIA City’s planned commercial and lifestyle destination.",
    link: "/commercial/retail-space",
  },
];

export default function PropertiesPage() {
  return (
    <PropertyCollectionPage
      hero={{
        eyebrow: "ONIRIA PROPERTIES",
        title: "Find Your Place in ONIRIA City",
        description:
          "Explore private villas, modern residences, apartments and commercial opportunities in Fumba, Zanzibar.",
        image:
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=85&w=2000&auto=format&fit=crop",
      }}
      introduction={{
        label: "PROPERTY COLLECTIONS",
        title: "Homes and spaces designed for different ways of life",
        description:
          "Each ONIRIA collection offers its own balance of comfort, privacy, convenience and connection to the wider community.",
      }}
      features={[
        {
          title: "Villas",
          description:
            "Private homes with generous layouts, gardens and tropical indoor-outdoor living.",
        },
        {
          title: "Residences",
          description:
            "Modern homes designed for convenience, natural light and community living.",
        },
        {
          title: "V Avenue",
          description:
            "Apartments, retail and commercial opportunities within the social heart of the destination.",
        },
      ]}
      properties={properties}
    />
  );
}