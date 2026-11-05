// Rate card for /x (sponsored posts on X). All prices are in USD.
//
// Set your own prices in RATES. Combo prices are computed from the items they bundle minus
// `save`, so changing a single rate updates every combo that includes it.

export const X_PROFILE = {
  handle: "@DevvratHans",
  href: "https://x.com/DevvratHans",
  /** Shown on the badge at the top of /x. Update it as you grow, or set to null to hide it. */
  followers: "380" as string | null,
  topics: ["Building Aback in public", "Growth and SEO numbers", "AI workflows", "Dev tools"],
};

export type RateId = "post" | "quote" | "repost" | "comment" | "pin" | "bio";

export interface Rate {
  name: string;
  /** Shorter name for combo lines, when `name` is long. */
  short?: string;
  detail: string;
  price: number;
  /** Add-ons are priced per 24 hours. */
  per?: "24h";
}

export const RATES: Record<RateId, Rate> = {
  post: { name: "Direct Post", detail: "Your product in its own post, with or without a link", price: 20 },
  quote: { name: "Plain Quote", detail: "I quote your post, plus a like and a comment on the original", price: 15 },
  repost: { name: "Plain Repost", detail: "A repost, plus a like and a comment on the original", price: 8 },
  comment: { name: "Just a Comment", short: "Comment", detail: "A thoughtful comment on your post", price: 3 },
  pin: { name: "Pin the Post or Quote", short: "Pin", detail: "Pinned to the top of my profile", price: 5, per: "24h" },
  bio: { name: "Link in Bio", detail: "Your link in my X bio", price: 8, per: "24h" },
};

export const CORE: RateId[] = ["post", "quote", "repost", "comment"];
export const ADD_ONS: RateId[] = ["pin", "bio"];

export interface Combo {
  name: string;
  items: RateId[];
  /** Discount off the sum of the items, in USD. */
  save: number;
}

export const COMBOS: Combo[] = [
  { name: "Quoted & Pinned", items: ["quote", "pin"], save: 3 },
  { name: "Launch Day", items: ["post", "repost", "comment"], save: 5 },
  { name: "Full Push", items: ["post", "pin", "bio"], save: 6 },
  { name: "The Works", items: ["post", "repost", "pin", "bio"], save: 9 },
];

export const comboPrice = (combo: Combo) => {
  const full = combo.items.reduce((sum, id) => sum + RATES[id].price, 0);
  return { full, price: full - combo.save };
};

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
