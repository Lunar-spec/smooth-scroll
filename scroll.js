const track = document.getElementById("image-track");

let isDragging = false;

const handleOnDown = e => {
    track.dataset.mouseDownAt = e.clientX;
    isDragging = true;
};

const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
    isDragging = false;
};

const handleOnMove = e => {
    if (!isDragging) return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;

    track.animate(
        {
            transform: `translate(${nextPercentage}%, -50%)`
        },
        { duration: 1200, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
        image.animate(
            {
                objectPosition: `${100 + nextPercentage}% center`
            },
            { duration: 1200, fill: "forwards" }
        );
    }
};
const handleOnMouseWheel = e => {
    e.preventDefault();

    const scrollDirection = e.deltaY > 0 ? "down" : "up";
    const percentageIncrement = 1;

    let accumulatedScroll = parseFloat(track.dataset.accumulatedScroll) || 0;
    accumulatedScroll += scrollDirection === "down" ? -percentageIncrement : percentageIncrement;

    accumulatedScroll = Math.max(Math.min(accumulatedScroll, 0), -100);

    track.dataset.accumulatedScroll = accumulatedScroll;
    // console.log(accumulatedScroll)

    track.animate(
        {
            transform: `translate(${accumulatedScroll}%, -50%)`
        },
        { duration: 2400, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
        image.animate(
            {
                objectPosition: `${100 + accumulatedScroll}% center`
            },
            { duration: 2400, fill: "forwards" }
        );
    }
};

window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);
window.addEventListener("mousewheel", handleOnMouseWheel);
