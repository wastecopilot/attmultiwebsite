/**
 * Image slots. Each file lives in att-site/public/images/ (`<file>.webp|.jpg|.jpeg|.png`) and is served through
 * next/image. A slot whose file is missing renders nothing, so no broken image can ever be shown.
 * Width and height are the stored file's dimensions. Prompts used to generate them: IMAGE-PROMPTS.md.
 */
export interface ImageSlot {
  file: string;
  alt: string;
  width: number;
  height: number;
}

const HERO = { width: 2400, height: 1165 };
const CARD = { width: 1200, height: 796 };
const SECTION = { width: 1600, height: 1061 };

export const images = {
  homeHero: { file: "home-hero", alt: "Family relaxing in a bright living room using a laptop, tablet and smartphone", ...HERO },
  internetHero: { file: "internet-hero", alt: "Home office desk with a laptop and a wireless router", ...HERO },
  fiberHero: { file: "fiber-hero", alt: "Woman working from home on a laptop in a bright living room", ...HERO },
  airHero: { file: "internet-air-hero", alt: "Wireless home internet gateway on a wooden side table in a living room", ...HERO },
  wirelessHero: { file: "wireless-hero", alt: "Three friends walking on a city sidewalk while using their smartphones", ...HERO },
  plansHero: { file: "plans-hero", alt: "Family of four sitting on a sofa, each using a smartphone", ...HERO },
  phoneDealsHero: { file: "phone-deals-hero", alt: "New smartphones laid out on a marble table", ...HERO },
  switchHero: { file: "switch-hero", alt: "Man setting up a new smartphone at his kitchen table", ...HERO },
  homePhoneHero: { file: "home-phone-hero", alt: "Woman in her kitchen beside a cordless home phone", ...HERO },
  dealsHero: { file: "deals-hero", alt: "Couple reviewing options together on a tablet in their living room", ...HERO },
  availabilityHero: { file: "availability-hero", alt: "Aerial view of a residential neighborhood at dusk", ...HERO },
  aboutHero: { file: "about-hero", alt: "Sales specialist wearing a headset assisting a customer by phone", ...HERO },
  contactHero: { file: "contact-hero", alt: "Woman speaking on her smartphone at home", ...HERO },
  faqHero: { file: "faq-hero", alt: "Man reading on a laptop at his dining table", ...HERO },
  cardFiber: { file: "card-fiber", alt: "Fiber-optic strands glowing with blue light", ...CARD },
  cardAir: { file: "card-internet-air", alt: "Wireless home internet gateway on a side table", ...CARD },
  cardWireless: { file: "card-wireless", alt: "Two smartphones side by side on a desk", ...CARD },
  cardPhone: { file: "card-home-phone", alt: "Cordless home phone on a kitchen counter", ...CARD },
  specialist: { file: "specialist", alt: "Sales specialist with a headset at her desk in a bright office", ...SECTION },
  bundle: { file: "bundle", alt: "Family at home using a laptop, smartphone and tablet", ...SECTION },
} satisfies Record<string, ImageSlot>;

export type ImageKey = keyof typeof images;
