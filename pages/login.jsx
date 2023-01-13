import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { auth, provider } from "../firebase";
import whatsappLogo from "../public/favicon.ico";

export default function Login() {
  const router = useRouter();
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
    router.push(`/`);
  };

  return (
    <div className="grid place-items-center h-screen bg-slate-200">
      <Head>
        <title>Login Page</title>
      </Head>

      <div className="flex flex-col justify-between items-center bg-white h-96 px-5 py-8 rounded-2xl">
        <h1 className="text-green-500 text-xl">Welcome to Whatsapp</h1>
        <Image
          src={whatsappLogo}
          width="180"
          height="180"
          alt="whatsapp Logo"
          priority
        />
        <footer>
          <div className="text-stone-700 text-md">
            Read our <span className="text-sky-500">Privacy Policy</span>,
            Tap,"Login" to accept the
            <span className="text-sky-500"> Terms of Service</span>
          </div>
          <div className="w-80 mx-auto">
            <button
              className=" bg-green-400 text-white p-2 mt-5 rounded-sm hover:bg-green-500 focus:scale-95 text-md  w-full"
              onClick={signIn}
            >
              LOGIN
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
