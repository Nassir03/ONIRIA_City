import EditorialPage from "../components/EditorialPage";

export const metadata = {
  title: "Vision | ONIRIA City",
  description:
    "Discover the vision behind ONIRIA City in Fumba, Zanzibar.",
};

export default function VisionPage() {
  return (
    <EditorialPage
      hero={{
        eyebrow: "THE ONIRIA VISION",
        title: "A New Way of Living in Zanzibar",
        description:
          "A destination where thoughtful architecture, nature and community create a more meaningful way of life.",
        image:
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=85&w=2000&auto=format&fit=crop",
      }}
      introduction={{
        label: "OUR PURPOSE",
        title: "Creating a place to live, connect and belong",
        description:
          "ONIRIA City is envisioned as a complete residential and lifestyle community in Fumba. It brings together homes, commerce, wellness, landscape and shared experiences within one carefully considered destination.",
      }}
      sections={[
        {
          title: "Designed around people",
          description:
            "Every part of ONIRIA City is planned to support comfortable living, meaningful connections and a strong sense of belonging.",
          image:
            "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Walkable neighbourhoods",
            "Welcoming shared spaces",
            "Homes for different stages of life",
            "A calm and secure environment",
          ],
        },
        {
          title: "Inspired by Zanzibar",
          description:
            "The destination draws inspiration from Zanzibar’s climate, coastline, natural textures, culture and relaxed rhythm of life.",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Tropical landscaping",
            "Indoor and outdoor living",
            "Natural materials and warm colours",
            "Ocean-inspired lifestyle",
          ],
        },
        {
          title: "Built for the future",
          description:
            "ONIRIA combines modern infrastructure, responsible planning and investment potential to create lasting value for residents and the wider community.",
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1500&auto=format&fit=crop",
          points: [
            "Long-term community planning",
            "Mixed residential and commercial use",
            "Quality public spaces",
            "A destination with enduring value",
          ],
          link: {
            label: "Explore the masterplan",
            href: "/masterplan",
          },
        },
      ]}
    />
  );
}