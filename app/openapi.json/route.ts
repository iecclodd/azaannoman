import { checkJsonRequest, jsonResponse } from "@/lib/api";
import { openapi } from "@/lib/openapi";
export const dynamic = "force-dynamic";
function handle(request: Request) {
  return checkJsonRequest(request) ?? jsonResponse(request, openapi);
}
export { handle as GET, handle as HEAD, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as OPTIONS };
