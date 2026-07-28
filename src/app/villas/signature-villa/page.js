import PropertyDetailPage from "../../components/PropertyDetailPage";

export const metadata = {
  title: "Signature Villa | ONIRIA City",
  description:
    "Explore the Signature Four-Bedroom Villa at ONIRIA City in Fumba, Zanzibar.",
};

const property = {
  collection: "ONIRIA VILLAS",
  title: "Signature Four-Bedroom Villa",
  location: "Fumba, Zanzibar",
  eyebrow: "SIGNATURE VILLA",
  heroImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=2000&auto=format&fit=crop",
  overviewTitle: "A generous private home shaped around family life",
  description:
    "The Signature Villa brings together spacious interiors, private outdoor areas, tropical landscaping and refined finishes. It is designed for owners seeking privacy, flexibility and a strong connection to Zanzibar’s relaxed environment.",
  facts: [
    {
      label: "Bedrooms",
      value: "4",
    },
    {
      label: "Bathrooms",
      value: "4",
    },
    {
      label: "Approximate area",
      value: "320 m²",
    },
    {
      label: "Property type",
      value: "Private villa",
    },
    {
      label: "Availability",
      value: "Register interest",
    },
  ],
  gallery: [
    {
      title: "Villa exterior",
      url:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1800&auto=format&fit=crop",
    },
    {
      title: "Main living room",
      url:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=85&w=1500&auto=format&fit=crop",
    },
    {
      title: "Private bedroom",
      url:
        "https://images.unsplash.com/photo-1615874694520-474822394e73?q=85&w=1500&auto=format&fit=crop",
    },
    {
      title: "Outdoor living",
      url:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=85&w=1500&auto=format&fit=crop",
    },
    {
      title: "Refined interior details",
      url:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=85&w=1500&auto=format&fit=crop",
    },
  ],
  features: [
    {
      title: "Private garden",
      description:
        "A landscaped outdoor area creates room for family activities, relaxation and entertaining.",
    },
    {
      title: "Open-plan living",
      description:
        "Generous living and dining areas support comfortable everyday life and social occasions.",
    },
    {
      title: "Natural light",
      description:
        "Large openings bring daylight into the home and strengthen the connection with the landscape.",
    },
    {
      title: "Family privacy",
      description:
        "Private bedrooms and flexible spaces allow residents and guests to enjoy comfort and independence.",
    },
  ],
  layoutImage:
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=85&w=1600&auto=format&fit=crop",
  layoutTitle: "Spaces created for everyday comfort",
  layoutDescription:
    "The villa layout balances shared family areas with private rooms, outdoor spaces and practical circulation.",
  layoutPoints: [
    "Four private bedrooms",
    "Open living and dining area",
    "Modern kitchen",
    "Private garden and terrace",
    "Guest and family spaces",
    "Dedicated storage areas",
  ],
};

export default function SignatureVillaPage() {
  return <PropertyDetailPage property={property} />;
}