const baselinka = document.createElement("div");

const getRelativeBaselinePosition = el => {
  const clone = el.cloneNode(true);
  const computedStyle = getComputedStyle(el);
  clone.style.cssText = computedStyle.cssText;
  clone.style.height = `${el.offsetHeight}px`;
  clone.style.width = `${el.offsetWidth}px`;
  clone.style.boxSizing = "border-box";

  const container = document.createElement("div");
  const marker = document.createElement("div");

  if ("inline" === computedStyle.display) {
    marker.style.cssText = `
            display: inline-block;
            vertical-align: baseline;
        `;
  } else {
    container.style.cssText = `
            display: flex;
            align-items: baseline;
        `;
    marker.style.cssText = `
            display: inline-flex;
        `;
  }

  container.appendChild(marker);
  container.appendChild(clone);

  document.body.appendChild(container);

  const diff = marker.offsetTop - clone.offsetTop;

  document.body.removeChild(container);

  return diff;
};

const handleElementEvent = ({ target }) => {
  if (target === baselinka) {
    return;
  }

  const { top, left, width } = target.getBoundingClientRect();
  const bl = getRelativeBaselinePosition(target);

  baselinka.style.cssText = `
        position: absolute;
        transition: all 0.3s cubic-bezier(0,1,.5,1);
        background: red;
        height: 1px;
        top: 0px;
        transform: translateY(${top + bl + window.pageYOffset}px);
        left: ${left}px;
        width: ${width}px;
    `;
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
