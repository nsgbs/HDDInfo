const darkModeSwitch = document.querySelector('.darkModeSwitch')
const rememberInfoButton = document.querySelector('.rememberInfoSwitch')

function sendConfigToServer(data) {
    fetch('/api/saveConfig', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .catch(error => {
            console.error('Saving config error:', error);
        });
}

function darkmodeChecker(hardState) {
    if (hardState !== undefined) {
        if (hardState) {

            document.querySelector('.coreHeader_nav').classList.add('darkmode');
            document.querySelector('#containerDiv').classList.add('darkmode');
            document.body.classList.add('darkmode');
        } else {
            document.querySelector('.coreHeader_nav').classList.remove('darkmode');
            document.querySelector('#containerDiv').classList.remove('darkmode');
            document.body.classList.remove('darkmode');
        }
    } else {
        fetch('/api/configInfo?configParameter=darkModeSwitch')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.querySelector('.coreHeader_nav').classList.add('darkmode');
                    document.querySelector('#containerDiv').classList.add('darkmode');
                    document.body.classList.add('darkmode');
                } else {
                    document.querySelector('.coreHeader_nav').classList.remove('darkmode');
                    document.querySelector('#containerDiv').classList.remove('darkmode');
                    document.body.classList.remove('darkmode');
                }
            })
    }
};


darkModeSwitch.addEventListener('click', () => {
    sendConfigToServer({ darkModeSwitch: darkModeSwitch.checked })
    darkmodeChecker(darkModeSwitch.checked);

    localStorage.setItem('darkModeEnabled', darkModeSwitch.checked);
})

rememberInfoButton.addEventListener('click', () => {
    sendConfigToServer({ rememberInfoButton: rememberInfoButton.checked })
})

window.onload = async function loadInfo() {
    fetch('/api/configInfo?configParameter=darkModeSwitch')
        .then(response => response.json())
        .then(data => darkModeSwitch.checked = data);
    fetch('/api/configInfo?configParameter=rememberInfoButton')
        .then(response => response.json())
        .then(data => rememberInfoButton.checked = data);
    darkmodeChecker(JSON.parse(localStorage.getItem('darkModeEnabled')));
}