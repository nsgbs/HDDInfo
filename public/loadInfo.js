const botaoGetInfo = document.getElementById('botaoGetInfo');
const sysMainStatusDiv = document.getElementById('systemMainStatusDiv');
const sysMainStatusDivData = document.getElementById('systemMainStatusDivData');
const listDevices = document.getElementById('listDevices');

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

function addParagraphsToDiv(divToAdd, innerHtmlData){
    let sysMainInfoP = document.createElement('p');
    sysMainInfoP.setAttribute('class', 'topMain-paragraph');
    sysMainInfoP.innerHTML = innerHtmlData;
    divToAdd.appendChild(sysMainInfoP);
}

function addDevicesToDiv(divDevices, innerHtmlData=[], hddHealth){
    let devicesMainContainer = document.createElement('div');
    devicesMainContainer.setAttribute('class', 'devicesMainContainer');
    let devicesMain = document.createElement('div');
    devicesMain.setAttribute('class', 'devicesMain');
    let devicesMainLeftBar = document.createElement('div');
    if (hddHealth >= 90)
        devicesMainLeftBar.setAttribute('class', 'tagImgHDD goodHealthHDD');
    else if (hddHealth < 90 && hddHealth >= 70)
        devicesMainLeftBar.setAttribute('class', 'tagImgHDD warningHealthHDD');
    else
        devicesMainLeftBar.setAttribute('class', 'tagImgHDD badHealthHDD')
    let hddIcon = document.createElement('img');
    hddIcon.setAttribute('class', 'hddIcon');
    hddIcon.setAttribute('src', '/hdd.ico');
    devicesMainLeftBar.appendChild(hddIcon);
    devicesMainContainer.appendChild(devicesMainLeftBar);
    let devicesMainP = document.createElement('p');
    innerHtmlData.forEach((value) => {
        devicesMainP = document.createElement('p');
        devicesMainP.setAttribute('class', 'deviceParagraph');
        devicesMainP.innerHTML = value;
        devicesMain.appendChild(devicesMainP);
    });
    devicesMainContainer.appendChild(devicesMain);
    divDevices.appendChild(devicesMainContainer);
}

function generateInfoPage(data){
    //clear old info
    sysMainStatusDivData.replaceChildren();
    listDevices.replaceChildren();

    //add system data
    if (data.Installed_version !== undefined){
        addParagraphsToDiv(sysMainStatusDivData, `Versão instalada: ${data.Installed_version}`);
        addParagraphsToDiv(sysMainStatusDivData, `Report criado em: ${data.Current_Date_And_Time}`);
        addParagraphsToDiv(sysMainStatusDivData, `Tempo de criação: ${data.Report_Creation_Time}`);
        addParagraphsToDiv(sysMainStatusDivData, `Nome do sistema: ${data.Computer_Name}`);
    }

    if (data.error !== undefined){
        addParagraphsToDiv(sysMainStatusDivData, data.error);
    }

    //signature
    let sysMainInfoP = document.createElement('p');
    sysMainInfoP.setAttribute('class', 'bottom-paragraph-signature');
    sysMainInfoP.innerHTML = 'Version v1.0.0';
    sysMainStatusDivData.appendChild(sysMainInfoP);
    
    //add devices
    for (let i=0; i < data.HDDQUANTITY; i++){
        //console.log("for cycle devices");
        addDevicesToDiv(listDevices, [
            `HDD num: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Hard_Disk_Number']}`,
            `Hard_Disk_Device: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Hard_Disk_Device']}`,
            `Hard_Disk_Model_ID: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Hard_Disk_Model_ID']}`,
            `Health: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Health']}`,
            `Performance: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Performance']}`,
            `Description: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Description']}`,
            `Action: ${data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Tip']}`
        ], parseInt(data['Physical_Disk_Information_Disk_' + i]['Hard_Disk_Summary']['Health']))
    }

}


botaoGetInfo.addEventListener('click', () => {
    fetch('/getNewInfo')
        .then(response => response.json())
        .then(data => generateInfoPage(data));
});

window.onload = async function loadInfo(){
    fetch('/api/configInfo?configParameter=rememberInfoButton')
    .then(response => response.json())
    .then(data => {
        if(data){
            fetch('/api/getLastInfo')
            .then(response => response.json())
            .then(dataInfo => generateInfoPage(dataInfo));
        }
    });
    darkmodeChecker(JSON.parse(localStorage.getItem('darkModeEnabled')));
}