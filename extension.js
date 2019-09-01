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
    let line = document.querySelector(".__LINE__");

    if (!line) {
        line = document.createElement("div");
        document.body.appendChild(line);
    }

    const {top, left, width} = target.getBoundingClientRect();
    const bl = getBaseline(target);

    line.style.cssText = `
		position: absolute;
		background: red;
		height: 1px;
		top: ${top + bl}px;
		left: ${left}px;
		width: ${width}px;
	`;
    line.className = "__LINE__";
};

document.addEventListener("mouseover", handler);