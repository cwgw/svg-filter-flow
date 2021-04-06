import Head from "next/head";
import FilterBuilder from "../components/FilterBuilder";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FilterBuilder />
    </div>
  );
}
