import { Handler, STATUS_CODE } from "$fresh/server.ts";

export const handler: Handler = {
    async GET(_req, ctx: any) {
        try {
            const queryString = ctx.url.search;
            const url = new URL("http://localhost" + queryString);
            const queryParams = url.searchParams;
            const getData = queryParams.get("data") || "";
            console.log({ getData });
            return new Response(null);
        } catch (error: any) {
            console.error(error);
            return new Response(error, {
                status: STATUS_CODE.InternalServerError,
            });
        }
    },
};
