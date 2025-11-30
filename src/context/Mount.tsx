import { createContext, useEffect, useMemo, useState } from "react";
import { ReactNode } from "react";

type MountContextType = { isMount: boolean }

export const MountContext = createContext<MountContextType | null>(null);

export function MountProvider({ children }: { children: ReactNode }) {
  const [isMount, setIsMount] = useState<boolean>(false);

  useEffect(() => {
    setIsMount(true);
    // console.log(`mount provider`);
  }, []);

  const value = useMemo(() => {
    return { isMount }
  }, [isMount]);

  return (
    <MountContext.Provider value={value}>
      {children}
    </MountContext.Provider>
  )
}
