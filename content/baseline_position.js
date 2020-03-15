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
        width: "fit-content"
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
