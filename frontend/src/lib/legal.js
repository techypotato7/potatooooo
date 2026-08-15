export const openLegal = (type) => {
  window.dispatchEvent(new CustomEvent("open-legal", { detail: type }));
};
