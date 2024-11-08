interface LinkItem {
  label: string;
  path: string;
}

interface LinkSection {
  title: string;
  items: LinkItem[];
}

const links: Record<"men" | "women" | "unisex", LinkSection[]> = {
  men: [
    {
      title: "Activewear",
      items: [
        { label: "All Products", path: "/collections/men/activewear" },
        { label: "Gym Shorts", path: "/collections/men/gym-shorts" },
        { label: "Gym Hoodies", path: "/collections/men/gym-hoodies" },
        { label: "Compression Tops", path: "/collections/men/compression-tops" },
        { label: "Gym Pants", path: "/collections/men/gym-pants" },
        { label: "Workout T-Shirts", path: "/collections/men/workout-t-shirts" },
        { label: "Joggers", path: "/collections/men/joggers" },
      ],
    },
    {
      title: "Accessories",
      items: [
        { label: "Gym Bags", path: "/collections/men/accessories/gym-bags" },
        { label: "Water Bottles", path: "/collections/men/accessories/water-bottles" },
        { label: "Shaker Bottles", path: "/collections/men/accessories/shaker-bottles" },
        { label: "Workout Gloves", path: "/collections/men/accessories/workout-gloves" },
        { label: "Headbands", path: "/collections/men/accessories/headbands" },
      ],
    },
    {
      title: "Trending",
      items: [
        { label: "New Arrivals", path: "/collections/men/trending/new-arrivals" },
        { label: "Best Sellers", path: "/collections/men/trending/best-sellers" },
        { label: "Limited Edition", path: "/collections/men/trending/limited-edition" },
        { label: "Sale", path: "/collections/men/trending/sale" },
      ],
    },
  ],
  women: [
    {
      title: "Activewear",
      items: [
        { label: "All Products", path: "/collections/women/activewear" },
        { label: "Sports Bras", path: "/collections/women/sports-bras" },
        { label: "Gym Leggings", path: "/collections/women/gym-leggings" },
        { label: "Gym Hoodies", path: "/collections/women/gym-hoodies" },
        { label: "Workout T-Shirts", path: "/collections/women/workout-t-shirts" },
        { label: "Joggers", path: "/collections/women/joggers" },
        { label: "Compression Tops", path: "/collections/women/compression-tops" },
      ],
    },
    {
      title: "Accessories",
      items: [
        { label: "Gym Bags", path: "/collections/women/accessories/gym-bags" },
        { label: "Water Bottles", path: "/collections/women/accessories/water-bottles" },
        { label: "Shaker Bottles", path: "/collections/women/accessories/shaker-bottles" },
        { label: "Workout Gloves", path: "/collections/women/accessories/workout-gloves" },
        { label: "Headbands", path: "/collections/women/accessories/headbands" },
        { label: "Yoga Mats", path: "/collections/women/accessories/yoga-mats" },
      ],
    },
    {
      title: "Trending",
      items: [
        { label: "New Arrivals", path: "/collections/women/trending/new-arrivals" },
        { label: "Best Sellers", path: "/collections/women/trending/best-sellers" },
        { label: "Limited Edition", path: "/collections/women/trending/limited-edition" },
        { label: "Sale", path: "/collections/women/trending/sale" },
      ],
    },
  ],
  unisex: [
    {
      title: "Activewear",
      items: [
        { label: "All Products", path: "/collections/unisex/activewear" },
        { label: "Hoodies", path: "/collections/unisex/hoodies" },
        { label: "Gym Pants", path: "/collections/unisex/gym-pants" },
        { label: "T-Shirts", path: "/collections/unisex/t-shirts" },
        { label: "Joggers", path: "/collections/unisex/joggers" },
        { label: "Compression Tops", path: "/collections/unisex/compression-tops" },
        { label: "Shorts", path: "/collections/unisex/shorts" },
      ],
    },
    {
      title: "Accessories",
      items: [
        { label: "Gym Bags", path: "/collections/unisex/accessories/gym-bags" },
        { label: "Water Bottles", path: "/collections/unisex/accessories/water-bottles" },
        { label: "Shaker Bottles", path: "/collections/unisex/accessories/shaker-bottles" },
        { label: "Workout Gloves", path: "/collections/unisex/accessories/workout-gloves" },
        { label: "Headbands", path: "/collections/unisex/accessories/headbands" },
        { label: "Yoga Mats", path: "/collections/unisex/accessories/yoga-mats" },
      ],
    },
    {
      title: "Trending",
      items: [
        { label: "New Arrivals", path: "/collections/unisex/trending/new-arrivals" },
        { label: "Best Sellers", path: "/collections/unisex/trending/best-sellers" },
        { label: "Limited Edition", path: "/collections/unisex/trending/limited-edition" },
        { label: "Sale", path: "/collections/unisex/trending/sale" },
      ],
    },
  ],
};

export default links;
