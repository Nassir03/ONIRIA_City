function SocialIcon({ children }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      {children}
    </svg>
  );
}

function InstagramIcon() {
  return (
    <SocialIcon>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.8" cy="7.2" r="0.8" />
    </SocialIcon>
  );
}

function FacebookIcon() {
  return (
    <SocialIcon>
      <path d="M14.6 8.2h2V5h-2.7c-3 0-4.3 1.8-4.3 4.4v2H7v3.3h2.6V21h3.5v-6.3h3l0.5-3.3h-3.5V9.7c0-1 0.4-1.5 1.5-1.5Z" />
    </SocialIcon>
  );
}

function LinkedInIcon() {
  return (
    <SocialIcon>
      <path d="M5.2 9.4h3.2V20H5.2V9.4Z" />
      <path d="M6.8 4.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8Z" />
      <path d="M10.8 9.4h3.1v1.4c0.5-0.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V20h-3.2v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20h-3.2V9.4Z" />
    </SocialIcon>
  );
}

function YouTubeIcon() {
  return (
    <SocialIcon>
      <path d="M21 8.3a3 3 0 0 0-2.1-2.1C17 5.7 12 5.7 12 5.7s-5 0-6.9 0.5A3 3 0 0 0 3 8.3 31.1 31.1 0 0 0 2.5 12 31.1 31.1 0 0 0 3 15.7a3 3 0 0 0 2.1 2.1c1.9 0.5 6.9 0.5 6.9 0.5s5 0 6.9-0.5a3 3 0 0 0 2.1-2.1 31.1 31.1 0 0 0 0.5-3.7 31.1 31.1 0 0 0-0.5-3.7Z" />
      <path d="M10.2 15.1V8.9L15.6 12l-5.4 3.1Z" />
    </SocialIcon>
  );
}

const defaultSocialUrls = {
  instagram: "https://www.instagram.com/oniriacity/",
  facebook: "https://www.facebook.com/oniriacity",
  linkedin: "https://www.linkedin.com/company/oniria-city",
  youtube: "https://www.youtube.com/@oniriacity",
};

export const socialLinks = [
  {
    name: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || process.env.NEXT_PUBLIC_ONIRIA_INSTAGRAM_URL || defaultSocialUrls.instagram,
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || process.env.NEXT_PUBLIC_ONIRIA_FACEBOOK_URL || defaultSocialUrls.facebook,
    Icon: FacebookIcon,
  },
  {
    name: "LinkedIn",
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL || process.env.NEXT_PUBLIC_ONIRIA_LINKEDIN_URL || defaultSocialUrls.linkedin,
    Icon: LinkedInIcon,
  },
  {
    name: "YouTube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL || process.env.NEXT_PUBLIC_ONIRIA_YOUTUBE_URL || defaultSocialUrls.youtube,
    Icon: YouTubeIcon,
  },
];

export function getConfiguredSocialLinks() {
  return socialLinks.filter((link) => Boolean(link.href));
}
