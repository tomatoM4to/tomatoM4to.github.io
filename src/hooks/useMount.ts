import { MountContext } from "@src/context/Mount";
import { useContext } from "react";

export function useMount() {
  const context = useContext(MountContext);

  if (context === null) {
    throw new Error(`useMount must be used within a MountProvider`);
  }

  return context;
}
