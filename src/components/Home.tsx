import { useEffect } from "react";

export default function Home({
  setInitialMount
}: {
  setInitialMount: Function
}) {
  useEffect(() => {
    setInitialMount(false);
  }, []);
  return (
    <h1>Home</h1>
  )
};
