import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

export default function HomePage() {
    const testRoute = async () => {
        try {
            const response = await axiod.get(
                "http://localhost:8000/api/test/",
                {
                    params: {
                        data: "sending data as params",
                    },
                },
            );
        } catch (error) {
            console.error(error);
        }
    };
    testRoute();
    return (
        <div>
            Home Page
        </div>
    );
}
