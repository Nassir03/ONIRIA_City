import EditorialPage from "../components/EditorialPage";

export const metadata = {
  title: "Amenities | ONIRIA City",
  description:
    "Explore the amenities, wellness spaces and community facilities at ONIRIA City.",
};

export default function AmenitiesPage() {
  return (
    <EditorialPage
      hero={{
        eyebrow: "AMENITIES & EXPERIENCES",
        title: "Everything You Need, Close to Home",
        description:
          "Wellness, recreation, nature, dining and everyday convenience brought together within one connected destination.",
        image:
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=85&w=2000&auto=format&fit=crop",
      }}
      introduction={{
        label: "EVERYDAY COMFORT",
        title: "Amenities designed for a complete lifestyle",
        description:
          "ONIRIA City is planned to support relaxation, movement, family life, social connection and everyday convenience.",
      }}
      sections={[
        {
          title: "Wellness and fitness",
          description:
            "Dedicated spaces support healthy routines, relaxation and physical activity throughout the community.",
          image:
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Fitness facilities",
            "Swimming areas",
            "Walking and cycling routes",
            "Relaxation and wellness spaces",
          ],
        },
        {
          title: "Family and recreation",
          description:
            "Children, families and residents of all ages can enjoy safe, welcoming spaces for play, activity and connection.",
          image:
            "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Children’s play areas",
            "Community parks",
            "Outdoor recreation",
            "Family gathering spaces",
          ],
        },
        {
          title: "Dining and retail",
          description:
            "V Avenue brings restaurants, cafés, shops and useful services within easy reach of residents and visitors.",
          image:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Restaurants and cafés",
            "Retail shops",
            "Professional services",
            "Social meeting places",
          ],
          link: {
            label: "Explore V Avenue",
            href: "/v-avenue",
          },
        },
        {
          title: "Nature and open spaces",
          description:
            "Landscaped gardens and shaded outdoor spaces create a peaceful setting for walking, rest and community life.",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Landscaped gardens",
            "Shaded pathways",
            "Outdoor seating",
            "Green community spaces",
          ],
        },
      ]}
    />
  );
}