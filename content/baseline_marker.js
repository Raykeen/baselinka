class BaselineMarker {
    baselinka = div({
        position: "absolute",
        transition: "all 0.3s cubic-bezier(0,1,.5,1)",
        borderTop: "1px solid red",
        color: "red",
        whiteSpace: "nowrap",
        height: "1px",
        top: "0px",
        zIndex: "999999999"
    });

    showFor = target => {
        if ([this.baselinka, document.body, document.documentElement].includes(target))
            return;

        const { top, left, width } = target.getBoundingClientRect();
        const position = getRelativeBaselinePosition(target);

        setStyles(this.baselinka, {
            transform: `translateY(${top + position + window.pageYOffset}px)`,
            left: `${left}px`,
            width: `${width}px`
        });

        this.baselinka.innerHTML = getSimpleSelector(target);
    };

    enable = () => {
        if (this.baselinka.parentNode !== document.body) {
            document.body.appendChild(this.baselinka);
        }
    };

    disable = () => {
        if (this.baselinka.parentNode === document.body) {
            document.body.removeChild(this.baselinka);
        }
    }
}
