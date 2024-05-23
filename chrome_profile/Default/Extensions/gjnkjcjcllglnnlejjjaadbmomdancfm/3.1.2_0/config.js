'use strict';


function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7],
        origin: `${match[1]}//${match[3]}`
    }
}
const getParams = (query) => {
    let params = {};
    if (query.startsWith('?')) {
        query = query.substring(1);
    }
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

let url = getLocation(chrome.runtime.getManifest().chrome_settings_overrides.search_provider.search_url);
const domain = `${url.hostname.split('.')[0]}.${url.hostname.split('.')[1]}.${url.hostname.split('.')[2]}`;
const hostName = `${url.hostname.split('.')[1]}.${url.hostname.split('.')[2]}`;
const params = getParams(url.search);

export const config = {
    domain: domain,
    hostName: hostName,
    yid: params['s'],
    vert: params['vert'],
    omnibox: chrome.runtime.getManifest().chrome_settings_overrides.search_provider.keyword,
    uninstall: `${url.origin}/wim/uninstall?s=${params['s']}&vert=${params['vert']}`,
    search: `${url.origin}${url.pathname}?category=web&s=${params['s']}&se=${params['vert']}`,
    thankYouPage: chrome.runtime.getManifest().homepage_url,
    rootHomePageUrl: `${chrome.runtime.getManifest().homepage_url}`,
    extId: chrome.runtime.id,
    extensionName: chrome.runtime.getManifest().name,
};