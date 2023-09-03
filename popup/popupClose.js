document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("closeButton");

    closeButton.addEventListener("click", function () {
        window.close();
    });

    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.hasOverlap !== undefined) {
            const resultDiv = document.querySelector('.result');
            const emojiSpan = document.querySelector('.emoji');
            const loaderDiv = document.querySelector('.loader');
            let confirmButton = document.querySelector('.confirm');

            if (message.hasOverlap) {
                emojiSpan.textContent = 'Some issues have been found 😢';  // sad face
            } else {
                emojiSpan.textContent = 'Excellent, all looks good 😊';  // smiley face
            }

            // Hide loader and show the result
            loaderDiv.style.display = 'none';
            resultDiv.style.display = 'block';

            confirmButton.textContent = "Test again";
        }
    });
});

document.querySelector('.confirm').addEventListener('click', function () {
    // Change button text
    this.textContent = "Analyzing";

    // Hide all children of .content except for the loader
    let contentDiv = document.querySelector('.content');
    for (let child of contentDiv.children) {
        if (child.className !== 'loader') {
            child.style.display = 'none';
        }
    }

    // Show the loader
    document.querySelector('.loader').style.display = 'block';

    // Fetch the currently active tab and then execute the content checker script on it
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentTab = tabs[0];

        // Try to execute the content script.
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['scripts/contentChecker.js']
        }, (result) => {
            if (chrome.runtime.lastError) {
                // Handle any error from the Chrome API or any other error
                alert('An error occurred: ' + chrome.runtime.lastError.message);
                resetPopup();
            }
        });
    });
});

function resetPopup() {
    // Change button text back to "Yes"
    let confirmButton = document.querySelector('.confirm');
    confirmButton.textContent = "Yes";

    // Show all children of .content and hide the loader
    let contentDiv = document.querySelector('.content');
    for (let child of contentDiv.children) {
        if (child.className !== 'loader') {
            child.style.display = 'block';
        } else {
            child.style.display = 'none';
        }
    }
}


