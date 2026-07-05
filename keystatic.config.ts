import { config, collection, fields } from "@keystatic/core";

const isDev = process.env.NODE_ENV === "development";

export default config({
  storage: isDev
    ? { kind: "local" }
    : {
        kind: "github",
        repo: { owner: "farzanahasan1", name: "diamondcritics" },
      },

  ui: {
    brand: { name: "DiamondCritics CMS" },
  },

  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        publishedAt: fields.date({
          label: "Published Date",
          defaultValue: { kind: "today" },
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Diamond Buying Guides", value: "diamond-buying-guides" },
            { label: "Diamond Retailer Reviews", value: "diamond-retailer-reviews" },
            { label: "Gemstone Guides", value: "gemstone-guides" },
            { label: "Market Value & Price Trends", value: "market-value-price-trends" },
            { label: "Round Cut Diamond", value: "round-cut-diamond" },
            { label: "Princess Cut Diamond", value: "princess-cut-diamond" },
            { label: "Oval Cut Diamond", value: "oval-cut-diamond" },
          ],
          defaultValue: "diamond-buying-guides",
        }),
        subcategory: fields.select({
          label: "Subcategory (optional)",
          options: [
            { label: "None", value: "" },
            { label: "Blue Nile", value: "blue-nile" },
          ],
          defaultValue: "",
        }),
        seoTitle: fields.text({ label: "SEO Title (60 chars max)" }),
        seoDescription: fields.text({
          label: "Meta Description (160 chars max)",
          multiline: true,
        }),
        featuredImage: fields.image({
          label: "Featured Image",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        content: fields.mdx({ label: "Content" }),
      },
    }),

    pages: collection({
      label: "Pages",
      slugField: "title",
      path: "content/pages/*",
      entryLayout: "content",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        seoTitle: fields.text({ label: "SEO Title" }),
        seoDescription: fields.text({ label: "Meta Description", multiline: true }),
        content: fields.mdx({ label: "Content" }),
      },
    }),
  },
});
