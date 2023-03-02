import { Title, Text } from "@tremor/react";
import Skeleton from "react-loading-skeleton";

export interface ShellProps {
  children: React.ReactNode;
  title: string;
  text?: string;
}

export default function Shell(props: ShellProps) {
  return (
    <main
      style={{
        border: "1px solid rgb(229 231 235)",
        borderWidth: "1px",
        borderRadius: "0.5rem",
        backgroundColor: "rgb(249 250 251)",
        padding: "1.5rem",
      }}
    >
      <Title>{props.title}</Title>
      <Text>{props.text || <Skeleton style={{ width: "25%" }} />}</Text>

      {props.children}
    </main>
  );
}
