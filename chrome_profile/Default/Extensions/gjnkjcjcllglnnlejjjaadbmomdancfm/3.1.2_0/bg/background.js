import {config} from '../config.js';
console.log('config: ',config)

chrome.runtime.onInstalled.addListener((data) => {
    if (data['reason'] === 'install') {
        setUninstallPage(config.uninstall);
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'getSettings') {
        chrome.storage.local.get('default_engine',({default_engine='yahoo'})=>{
            chrome.storage.local.get('use_ac',({use_ac='true'})=>{
                chrome.storage.local.get('cookie_permission',({cookie_permission='false'})=>{
                    sendResponse({
                        defaultSearch: default_engine,
                        useAC: use_ac,
                        cookiePermission: cookie_permission
                    })
                })
            })
        })       
        // sendResponse({
        //     defaultSearch: localStorage.getItem('default_engine') ? localStorage.getItem('default_engine') : 'yahoo',
        //     useAC: localStorage.getItem('use_ac') ? localStorage.getItem('use_ac') : 'true',
        //     cookiePermission: localStorage.getItem('cookie_permission') ? localStorage.getItem('cookie_permission') : 'false'
        // });
    } else if (request.message === 'setDefaultSearchEngine') {
        writeCookie('se', request.engine);
        saveSettings('default_engine', request.engine);
    } else if (request.message === 'setACSettings') {
        writeCookie('use_ac', request.useAC);
        saveSettings('use_ac', request.useAC);
    } else if (request.message === 'setCookiePermission') {
        saveSettings('cookie_permission', request.cookiePermission);
    }
    return true; //keeps the message channel open until `sendResponse` is executed.
});

function setUninstallPage(url = null) {
    if (typeof url === 'string') {
        chrome.runtime.setUninstallURL(url);
    }
}

function saveSettings(key, value) {
    chrome.storage.local.set({[key]: value});
}

function writeCookie(cookieName, cookieValue) {    
    chrome.permissions.contains({
        permissions: ['cookies'],
        origins: ['https://www.secured-browse.net/*']
    }, function (result) {
        if (result) {
            chrome.cookies.set({
                url: `https://${config.domain}`,
                name: cookieName,
                value: cookieValue,
                domain: `.${config.hostName}`,
                secure: true,
                sameSite: 'no_restriction',
            });
        }
    });

}