import { getSiteName, SiteName } from "@/helpers/client-side.helper";
import Head from "next/head";
import React from "react";

export type SeoProps = JSX.IntrinsicElements["div"] & {
  title?: string;
  description?: string;
};
export default class Seo extends React.Component<SeoProps> {
  render() {
    return (
      <Head>
        <title>{getSiteName(this.props.title ?? "")}</title>
        <meta name="description" content={this.props.description ?? ""} />
      </Head>
    );
  }
}
