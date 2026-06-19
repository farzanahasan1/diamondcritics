export const dynamic = "force-dynamic";

type RouteHandler = (req: Request, ctx: { params: Promise<Record<string, string | string[]>> }) => Promise<Response>;

let _handler: { GET: RouteHandler; POST: RouteHandler } | null = null;

async function getHandler() {
  if (!_handler) {
    const { makeRouteHandler } = await import("@keystatic/next/route-handler");
    const { default: config } = await import("../../../../../keystatic.config");
    _handler = makeRouteHandler({ config });
  }
  return _handler;
}

export async function GET(req: Request, ctx: { params: Promise<Record<string, string | string[]>> }) {
  const h = await getHandler();
  return h.GET(req, ctx);
}

export async function POST(req: Request, ctx: { params: Promise<Record<string, string | string[]>> }) {
  const h = await getHandler();
  return h.POST(req, ctx);
}
