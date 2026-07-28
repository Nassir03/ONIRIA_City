import EditorialPage from "../components/EditorialPage";

export const metadata = {
  title: "Lifestyle | ONIRIA City",
  description:
    "Discover the ocean, nature, wellness and community lifestyle of ONIRIA City.",
};

export default function LifestylePage() {
  return (
    <EditorialPage
      hero={{
        eyebrow: "THE ONIRIA LIFESTYLE",
        title: "Life Inspired by Zanzibar",
        description:
          "Ocean experiences, tropical nature, wellness, dining and community brought together in one destination.",
        image:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=85&w=2000&auto=format&fit=crop",
      }}
      introduction={{
        label: "LIVE DIFFERENTLY",
        title: "More than a home, a complete way of life",
        description:
          "ONIRIA City creates opportunities to relax, connect, explore and enjoy Zanzibar every day.",
      }}
      sections={[
        {
          title: "Nature",
          description:
            "Tropical landscaping, shaded paths and outdoor spaces allow residents to remain close to nature.",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Tropical gardens",
            "Green walking routes",
            "Outdoor gathering areas",
            "Peaceful natural surroundings",
          ],
        },
        {
          title: "Wellness",
          description:
            "Spaces for movement, relaxation and restoration support healthier daily routines.",
          image:
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Fitness and activity spaces",
            "Swimming and relaxation",
            "Walking and cycling",
            "Quiet wellness areas",
          ],
        },
        {
          title: "Dining and social life",
          description:
            "Restaurants, cafés and welcoming public spaces make it easy to meet, celebrate and share experiences.",
          image:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Island-inspired dining",
            "Cafés and social spaces",
            "Community celebrations",
            "Convenient nearby services",
          ],
        },
        {
          title: "Ocean experiences",
          description:
            "Zanzibar’s sea, sunrise and sunset become part of the wider ONIRIA lifestyle.",
          image:
            "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Coastal experiences",
            "Sunrise and sunset moments",
            "Water activities",
            "Relaxed island living",
          ],
        },
      ]}
    />
  );
}