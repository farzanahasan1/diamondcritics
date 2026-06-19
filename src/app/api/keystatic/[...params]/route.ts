export const dynamic = "force-dynamic";

import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

const handler = makeRouteHandler({ config });

export const GET = handler.GET;
export const POST = handler.POST;
