import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "@tremor/react/dist/esm/tremor.css";
import { Subtitle } from "@tremor/react";
import Header from "@/components/header/header.component";
import Modal from "react-modal";

Modal.setAppElement("#__next");

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="container">
        <div className="box box-1">
          <Header></Header>
        </div>

        <main className="box box-2">
          <Component {...pageProps} />
        </main>

        <div className="box box-3">
          <Subtitle>By K4CZP3R</Subtitle>
        </div>
      </div>
    </SessionProvider>
  );
}
