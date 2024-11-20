import { PageProps } from "$fresh/server.ts";
import HomePage from "../islands/auth/HomePage.tsx";

export default function Home({ state }: PageProps) {
  console.log({ state });
  return (
    <div>
      <h1 class="text-2xl font-medium p-4 text-gray-300">
        Welcome Back, Full Stack Explorers!
      </h1>
      <HomePage />
    </div>
  );
}
