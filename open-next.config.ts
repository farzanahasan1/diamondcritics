import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  incrementalCache: async () =>
    (await import("@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache")).default,
  queue: async () =>
    (await import("@opennextjs/cloudflare/overrides/queue/memory-queue")).default,
});
