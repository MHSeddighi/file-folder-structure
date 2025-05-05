import { useEffect, useState } from "react";
import styles from "./Content.module.css";
import { useFileTree } from "../hooks/useFileTree";

export const Content = () => {
  const { selectedItemId, state } = useFileTree();
  const [path, setPath] = useState("");

  useEffect(() => {
    const element = state.find(selectedItemId);
    if (element) setPath(element?.node?.value?.path ?? "");
  }, [selectedItemId]);

  return <div className={styles.wrapper}>{path}</div>;
};

export default Content;
