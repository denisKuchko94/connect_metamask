import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { StateContextProvider } from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StateContextProvider>
      <Component {...pageProps} />
    </StateContextProvider>
  );
}
