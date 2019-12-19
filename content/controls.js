const baselineMarker = new BaselineMarker();

let shiftFromTarget = 0;

const handleElementEvent = ({ target }) => {
  shiftFromTarget = 0;

  baselineMarker.showFor(target);
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

  baselineMarker.showFor(baselineTarget);
};

const enable = () => {
  baselineMarker.enable();

  document.addEventListener("mouseover", handleElementEvent);
  document.addEventListener("wheel", handleWheel, { passive: false });
};

const disable = () => {
  baselineMarker.disable();

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
