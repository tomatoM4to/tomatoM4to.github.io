import {
  createContext,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ReactNode } from "react";

type MountContextType = { isMount: boolean }
type NetworkMountContextType = { networkMountRef: RefObject<boolean> }

export const MountContext = createContext<MountContextType | null>(null);
export const NetworkMountContext = createContext<NetworkMountContextType | null>(null);

export function MountProvider({ children }: { children: ReactNode }) {
  const [isMount, setIsMount] = useState<boolean>(false);
  const networkMountRef = useRef<boolean>(false);

  useEffect(() => {
    setIsMount(true);
    networkMountRef.current = true;
  }, []);

  const value = useMemo(() => {
    return { isMount }
  }, [isMount]);

  return (
    <MountContext.Provider value={value}>
      <NetworkMountContext.Provider value={{ networkMountRef }}>
        {children}
      </NetworkMountContext.Provider>
    </MountContext.Provider>
  )
}
