function doRectsOverlap(rect1, rect2) {
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}

function getTextNodesIn(elem) {
    let textNodes = [];
    for (let node of elem.childNodes) {
        if (node.nodeType === 3 && node.textContent.trim() !== '') {
            textNodes.push(node);
        }
    }
    return textNodes;
}

//const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li, td, th'))
const textElements = Array.from(document.querySelectorAll('p'))
    .filter(el => el.textContent.trim() !== '');

const temporaryDivs = [];

textElements.forEach(el => {
    getTextNodesIn(el).forEach(textNode => {
        const range = document.createRange();
        range.selectNode(textNode);
        const rect = range.getBoundingClientRect();

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = `${rect.left}px`;
        tempDiv.style.top = `${rect.top}px`;
        tempDiv.style.width = `${rect.width}px`;
        tempDiv.style.height = `${rect.height}px`;
        tempDiv.style.pointerEvents = 'none'; // To ensure they don't interfere with any user interactions

        document.body.appendChild(tempDiv);
        temporaryDivs.push(tempDiv);
    });
});

let hasOverlap = false;

for (let i = 0; i < temporaryDivs.length; i++) {
    for (let j = i + 1; j < temporaryDivs.length; j++) {
        if (doRectsOverlap(temporaryDivs[i].getBoundingClientRect(), temporaryDivs[j].getBoundingClientRect())) {
            textElements[i].style.backgroundColor = 'yellow';
            textElements[j].style.backgroundColor = 'yellow';
            hasOverlap = true;
        }
    }
}

// Clean up by removing the temporary divs
temporaryDivs.forEach(div => {
    document.body.removeChild(div);
});

// Send a message back to the popup script with the result
chrome.runtime.sendMessage({ hasOverlap: hasOverlap });