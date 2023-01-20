import Head from "next/head";
import Load from "../Components/Load";
import Sidebar from "../Components/Sidebar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <Load />
    </>
  );
}
