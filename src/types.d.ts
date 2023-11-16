export type ValueOf<T> = T[keyof T];

export type TouchToMouseParams = { deep?: boolean };
export type TouchToMouseReturn = { destroy: () => void } | void;

export type TouchToMouse = (
  node: HTMLElement,
  params?: TouchToMouseParams
) => TouchToMouseReturn;
