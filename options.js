document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    chrome.storage.local.get(['logoChoice', 'noFavicon']).then((result) => {
        document.getElementById('logoChoice').value = result.logoChoice || 'default';
        document.getElementById('noFavicon').checked = result.noFavicon || false;
    });

    // Save settings when the save button is clicked
    document.getElementById('save').addEventListener('click', () => {
        const logoChoice = document.getElementById('logoChoice').value;
        const noFavicon = document.getElementById('noFavicon').checked;

        chrome.storage.local.set({ logoChoice, noFavicon });
    });
});