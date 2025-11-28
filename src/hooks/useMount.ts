import { useState } from "react";

export function useMount() {
  const [mount, _setMount] = useState<boolean>(true);
  function setMount() {
    _setMount(false);
  }
  return { mount, setMount };
}
