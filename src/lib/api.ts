import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(process.env.WORDPRESS_API_URL!);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  modified: string;
  excerpt: string;
  content: string;
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
  categories: { nodes: { name: string; slug: string }[] };
  seo?: SEO;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  modified: string;
  seo?: SEO;
}

export interface SEO {
  title: string;
  metaDesc: string;
  canonical: string;
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphImage: { sourceUrl: string } | null;
  schema: { raw: string } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const SEO_FIELDS = `
  seo {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage { sourceUrl }
    schema { raw }
  }
`;

// All post slugs (for static generation)
export async function getAllPostSlugs(): Promise<string[]> {
  const query = `
    query AllPostSlugs {
      posts(first: 200) {
        nodes { slug }
      }
    }
  `;
  const data: any = await client.request(query);
  return data.posts.nodes.map((n: any) => n.slug);
}

// All page slugs (for static generation)
export async function getAllPageSlugs(): Promise<string[]> {
  const query = `
    query AllPageSlugs {
      pages(first: 100) {
        nodes { slug }
      }
    }
  `;
  const data: any = await client.request(query);
  return data.pages.nodes.map((n: any) => n.slug);
}

// Single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id title slug date modified excerpt content
        featuredImage { node { sourceUrl altText } }
        categories { nodes { name slug } }
        ${SEO_FIELDS}
      }
    }
  `;
  const data: any = await client.request(query, { slug });
  return data.post ?? null;
}

// Single page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const query = `
    query PageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id title slug content modified
        ${SEO_FIELDS}
      }
    }
  `;
  const data: any = await client.request(query, { slug });
  return data.page ?? null;
}

// Posts for homepage feed
export async function getLatestPosts(count = 12): Promise<Post[]> {
  const query = `
    query LatestPosts($count: Int!) {
      posts(first: $count) {
        nodes {
          id title slug date excerpt
          featuredImage { node { sourceUrl altText } }
          categories { nodes { name slug } }
        }
      }
    }
  `;
  const data: any = await client.request(query, { count });
  return data.posts.nodes;
}

// Posts by category slug
export async function getPostsByCategory(
  categorySlug: string,
  count = 20
): Promise<{ posts: Post[]; category: Category }> {
  const query = `
    query PostsByCategory($slug: ID!, $count: Int!) {
      category(id: $slug, idType: SLUG) {
        id name slug description count
        posts(first: $count) {
          nodes {
            id title slug date excerpt
            featuredImage { node { sourceUrl altText } }
            categories { nodes { name slug } }
          }
        }
      }
    }
  `;
  const data: any = await client.request(query, { slug: categorySlug, count });
  const category = data.category;
  return {
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      count: category.count,
    },
    posts: category.posts.nodes,
  };
}

// All categories
export async function getAllCategories(): Promise<Category[]> {
  const query = `
    query AllCategories {
      categories(first: 50) {
        nodes { id name slug description count }
      }
    }
  `;
  const data: any = await client.request(query);
  return data.categories.nodes;
}

// Menu items (if WPGraphQL for ACF or menus plugin installed)
export async function getMenuItems(location = 'PRIMARY'): Promise<{ label: string; url: string }[]> {
  const query = `
    query MenuItems($location: MenuLocationEnum!) {
      menuItems(where: { location: $location }, first: 50) {
        nodes { label url }
      }
    }
  `;
  try {
    const data: any = await client.request(query, { location });
    return data.menuItems.nodes;
  } catch {
    return [];
  }
}
