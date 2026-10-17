import { getCollection } from "astro:content";

const isProduction = import.meta.env.MODE === "production";

export const publishedPosts = await getCollection(
  "post",
  (post) => !isProduction || !post.data.isDraft,
);

export const dateSortedPublishedPosts = [...publishedPosts].sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
);

export const sortedPostCategories = [
  ...new Set(publishedPosts.map((post) => post.data.category)),
].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

export const postsByCategory = sortedPostCategories.map((category) => ({
  category,
  posts: dateSortedPublishedPosts.filter((post) => post.data.category === category),
}));
