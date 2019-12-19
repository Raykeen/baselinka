const setStyles = (element, styles) => Object.assign(element.style, styles);

const div = (styles = {}) => {
  const element = document.createElement("div");

  setStyles(element, styles);

  return element;
};

const baselinka = div({
  position: "absolute",
  transition: "all 0.3s cubic-bezier(0,1,.5,1)",
  borderTop: "1px solid red",
  color: "red",
  whiteSpace: "nowrap",
  height: "1px",
  top: "0px",
  zIndex: "999999999"
});

const createContainerForFlex = () =>
  div({
    display: "flex",
    alignItems: "baseline"
  });

const createDummyForFlex = () =>
  div({
    display: "inline-flex"
  });

const createContainerForInline = () =>
  div({
    whiteSpace: "nowrap"
  });

const createDummyForInline = () =>
  div({
    display: "inline-block",
    verticalAlign: "baseline"
  });

const createInlineWrapper = () =>
  div({
    display: "inline-block"
  });

const getRelativeBaselinePosition = el => {
  const clone = el.cloneNode(true);

  const clientRect = el.getBoundingClientRect();
  const computedStyle = getComputedStyle(el);
  const parentComputedStyle = getComputedStyle(el.parentNode);

  const hasFlexParent = parentComputedStyle.display.includes("flex");
  const isInlineElement = computedStyle.display.includes("inline");

  setStyles(clone, {
    height: `${clientRect.height}px`,
    width: `${clientRect.width}px`,
    boxSizing: "border-box",
    top: "unset",
    left: "unset",
    bottom: "unset",
    right: "unset"
  });

  const container = hasFlexParent
    ? createContainerForFlex()
    : createContainerForInline();
  const marker = hasFlexParent ? createDummyForFlex() : createDummyForInline();

  container.appendChild(marker);

  if (!hasFlexParent && !isInlineElement) {
    const inlineContainer = createInlineWrapper();

    inlineContainer.appendChild(clone);
    container.appendChild(inlineContainer);
  } else {
    container.appendChild(clone);
  }

  document.body.appendChild(container);

  const diff = marker.offsetTop - clone.offsetTop;

  document.body.removeChild(container);

  return diff;
};

const showBaselineFor = target => {
  if ([baselinka, document.body, document.documentElement].includes(target))
    return;

  const { top, left, width } = target.getBoundingClientRect();
  const bl = getRelativeBaselinePosition(target);

  setStyles(baselinka, {
    transform: `translateY(${top + bl + window.pageYOffset}px)`,
    left: `${left}px`,
    width: `${width}px`
  });

  baselinka.innerHTML =
    target.tagName +
    target.id
      .split(" ")
      .filter(Boolean)
      .map(id => "#" + id) +
    target.className
      .split(" ")
      .filter(Boolean)
      .map(className => "." + className);
};

let shiftFromTarget = 0;

const handleElementEvent = ({ target }) => {
  shiftFromTarget = 0;

  showBaselineFor(target);
};

const handleWheel = evt => {
  const { altKey, target, wheelDelta } = evt;

  if (!altKey) return;

  evt.preventDefault();

  let baselineTarget = target;

  if (wheelDelta < 0) shiftFromTarget++;
  if (wheelDelta > 0 && shiftFromTarget > 0) shiftFromTarget--;

  for (let i = 0; i < shiftFromTarget; i++) {
    baselineTarget = baselineTarget.parentNode || baselineTarget;
  }

  if (baselineTarget === document.body) {
    if (shiftFromTarget > 0) shiftFromTarget--;

    return;
  }

  showBaselineFor(baselineTarget);
};

const enable = () => {
  if (baselinka.parentNode !== document.body) {
    document.body.appendChild(baselinka);
  }

  document.addEventListener("mouseover", handleElementEvent);
  document.addEventListener("wheel", handleWheel, { passive: false });
};

const disable = () => {
  if (baselinka.parentNode === document.body) {
    document.body.removeChild(baselinka);
  }

  document.removeEventListener("mouseover", handleElementEvent);
  document.removeEventListener("wheel", handleWheel);
};

chrome.runtime.onMessage.addListener(({ message }) => {
  switch (message) {
    case "baselinka/enable":
      enable();
      break;
    case "baselinka/disable":
      disable();
      break;
  }
});
