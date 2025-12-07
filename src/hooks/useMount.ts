import { HeadMountContext, MountContext, NetworkMountContext } from "@src/context/Mount";
import { useContext } from "react";

export function useMount() {
  const context = useContext(MountContext);

  if (context === null) {
    throw new Error(`useMount must be used within a MountProvider`);
  }

  return context;
}

export function useNetworkMount() {
  const context = useContext(NetworkMountContext);

  if (context === null) {
    throw new Error(`useNetworkMount must be used within a MountProvider`);
  }

  return context;
}

export function useHeadMount() {
  const context = useContext(HeadMountContext);

  if (context === null) {
    throw new Error(`useHeadMount must be used within a MountProvider`);
  }

  return context;
}