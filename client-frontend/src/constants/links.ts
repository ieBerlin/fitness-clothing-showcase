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
      title: "Products",
      items: [
        { label: "All Products", path: "/collections/men/all-products" },
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
        { label: "Gym Bags", path: "/collections/men/gym-bags" },
        { label: "Water Bottles", path: "/collections/men/water-bottles" },
        { label: "Shaker Bottles", path: "/collections/men/shaker-bottles" },
        { label: "Workout Gloves", path: "/collections/men/workout-gloves" },
        { label: "Headbands", path: "/collections/men/headbands" },
      ],
    },
    {
      title: "Trending",
      items: [
        { label: "New Arrivals", path: "/collections/men/new-arrivals" },
        { label: "Best Sellers", path: "/collections/men/best-sellers" },
        { label: "Limited Edition", path: "/collections/men/limited-edition" },
        { label: "Sale", path: "/collections/men/sale" },
      ],
    },
  ],
  women: [
    {
      title: "Products",
      items: [
        { label: "All Products", path: "/collections/women/all-products" },
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
        { label: "Gym Bags", path: "/collections/women/gym-bags" },
        { label: "Water Bottles", path: "/collections/women/water-bottles" },
        { label: "Shaker Bottles", path: "/collections/women/shaker-bottles" },
        { label: "Workout Gloves", path: "/collections/women/workout-gloves" },
        { label: "Headbands", path: "/collections/women/headbands" },
        { label: "Yoga Mats", path: "/collections/women/yoga-mats" },
      ],
    },
    {
      title: "Trending",
      items: [
        { label: "New Arrivals", path: "/collections/women/new-arrivals" },
        { label: "Best Sellers", path: "/collections/women/best-sellers" },
        { label: "Limited Edition", path: "/collections/women/limited-edition" },
        { label: "Sale", path: "/collections/women/sale" },
      ],
    },
  ],
  unisex: [
    {
      title: "Products",
      items: [
        { label: "All Products", path: "/collections/unisex/all-products" },
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
        { label: "Gym Bags", path: "/collections/unisex/gym-bags" },
        { label: "Water Bottles", path: "/collections/unisex/water-bottles" },
        { label: "Shaker Bottles", path: "/collections/unisex/shaker-bottles" },
        { label: "Workout Gloves", path: "/collections/unisex/workout-gloves" },
        { label: "Headbands", path: "/collections/unisex/headbands" },
        { label: "Yoga Mats", path: "/collections/unisex/yoga-mats" },
      ],
    },
    {
      title: "Trending",
      items: [
        { label: "New Arrivals", path: "/collections/unisex/new-arrivals" },
        { label: "Best Sellers", path: "/collections/unisex/best-sellers" },
        { label: "Limited Edition", path: "/collections/unisex/limited-edition" },
        { label: "Sale", path: "/collections/unisex/sale" },
      ],
    },
  ],
};

export default links;
