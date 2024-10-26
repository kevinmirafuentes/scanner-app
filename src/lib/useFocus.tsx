import React from "react";

export default function useFocus<T extends HTMLElement = HTMLElement>() {
  const ref = React.useRef<T>(null);
  const setFocus = () => ref?.current?.focus?.();

  return [ref, setFocus] as const;
}
