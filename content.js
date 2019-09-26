const baselinka = document.createElement("div");

const getRelativeBaselinePosition = el => {
  const clone = el.cloneNode(true);
  const client = el.getBoundingClientRect();
  const computedStyle = getComputedStyle(el);
  const parentComputedStyle = getComputedStyle(el.parentNode);
  const hasFlexParent = parentComputedStyle.display.includes("flex");
  const isInlineElement = computedStyle.display.includes("inline");

  clone.style.cssText = `
    ${computedStyle.cssText}
    height: ${client.height}px;
    width: ${client.width}px;
    box-sizing: border-box;
    top: unset;
    left: unset;
    bottom: unset;
    right: unset;
  `;

  const container = document.createElement("div");
  const marker = document.createElement("div");

  if (hasFlexParent) {
    container.style.cssText = `
        display: flex;
        align-items: baseline;
    `;
    marker.style.cssText = `
        display: inline-flex;
    `;
  } else {
    marker.style.cssText = `
        display: inline-block;
        vertical-align: baseline;
    `;
  }

  container.appendChild(marker);

  if (!hasFlexParent && !isInlineElement) {
    const inlineContainer = document.createElement("div");
    inlineContainer.style.cssText = `
      display: inline-block;
    `;
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

const handleElementEvent = ({ target }) => {
  if ([baselinka, document.body, document.documentElement].includes(target)) {
    return;
  }

  const { top, left, width } = target.getBoundingClientRect();
  const bl = getRelativeBaselinePosition(target);

  baselinka.style.cssText = `
        position: absolute;
        transition: all 0.3s cubic-bezier(0,1,.5,1);
        border-top: 1px solid red;
        color: red;
        white-space: nowrap;
        height: 1px;
        top: 0px;
        z-index: 999999999;
        transform: translateY(${top + bl + window.pageYOffset}px);
        left: ${left}px;
        width: ${width}px;
    `;
  baselinka.innerHTML =
    target.tagName +
    target.id.split(" ").filter(Boolean).map(id => "#" + id) +
    target.className.split(" ").filter(Boolean).map(className => "." + className);
};

const enable = () => {
  if (baselinka.parentNode !== document.body) {
    document.body.appendChild(baselinka);
  }

  document.addEventListener("mouseover", handleElementEvent);
};

const disable = () => {
  if (baselinka.parentNode === document.body) {
    document.body.removeChild(baselinka);
  }

  document.removeEventListener("mouseover", handleElementEvent);
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
