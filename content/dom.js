const setStyles = (element, styles) => Object.assign(element.style, styles);

const div = (styles = {}) => {
  const element = document.createElement("div");

  setStyles(element, styles);

  return element;
};

const getSimpleSelector = element =>
  element.tagName +
  element.id
    .split(" ")
    .filter(Boolean)
    .map(id => "#" + id).join("") +
  Array.from(element.classList).map(className => "." + className).join("");
