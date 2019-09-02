const baselinka = document.createElement("div");

const getBaseline = (el) => {
    const clone = el.cloneNode(true);

    const container = document.createElement("div");
    container.style.cssText = `
		display: flex;
		align-items: baseline;
	`;

    const marker = document.createElement("div");
    marker.style.cssText = `
		display: inline-flex;
	`;

    container.appendChild(marker);
    container.appendChild(clone);

    document.body.appendChild(container);

    const diff = marker.offsetTop - clone.offsetTop;

    document.body.removeChild(container);

    return diff;
};

const handler = ({target}) => {
    const {top, left, width} = target.getBoundingClientRect();
    const bl = getBaseline(target);

    baselinka.style.cssText = `
		position: absolute;
		transition: all 0.3s cubic-bezier(0,1,.5,1);
		background: red;
		height: 1px;
		top: ${top + bl + window.pageYOffset}px;
		left: ${left}px;
		width: ${width}px;
	`;
};

const enable = () => {
    if (baselinka.parentNode !== document.body) {
        document.body.appendChild(baselinka);
    }

    document.addEventListener("mouseover", handler);
};

const disable = () => {
    if (baselinka.parentNode === document.body) {
        document.body.removeChild(baselinka);
    }

    document.removeEventListener("mouseover", handler);
};

chrome.runtime.onMessage.addListener(
    ({ message }) => {
        console.log(message);

        switch (message) {
            case "baselinka/enable":
                enable();
                break;
            case "baselinka/disable":
                disable();
                break;
        }
    }
);