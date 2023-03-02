import { Title, Text } from "@tremor/react";
import Skeleton from "react-loading-skeleton";

import styles from "./shell.module.css";

export interface ShellProps {
  children: React.ReactNode;
  title: string;
  text?: string;
}

export default function Shell(props: ShellProps) {
  return (
    <main className={styles.main}>
      <Title>{props.title}</Title>
      <Text>{props.text || <Skeleton style={{ width: "25%" }} />}</Text>

      {props.children}
    </main>
  );
}
