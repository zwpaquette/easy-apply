import {config} from "../config.js";

//migrate from localstorage to chrome.storage from mv2 to mv3
if(chrome.runtime.getManifest().manifest_version==3 && localStorage.length>0){  
    for (const key in localStorage) {
        if (Object.hasOwnProperty.call(localStorage, key)) {
            const value = localStorage[key];
            chrome.storage.local.set({[key]:value})
            localStorage.removeItem(key)
        }
    }
}

$(document).ready(function () {
    const engineBtn = $('.engine-btn');
    const engineWrap = $('.engine-wrap');
    const engineItems = $('.engine-item');

    for (let i = 0; i < engineItems.length; i++) {
        $(engineItems[i]).on('click', function () {
            $(this).toggleClass('active');
        })
    }

    chrome.runtime.sendMessage({message: 'getSettings'}, response => {
        const defaultSearchEngine = response.defaultSearch;
        const useAC = response.useAC;
        const cookiePermission = response.cookiePermission;

        $('.setting-select').select2({
            templateResult: formatState,
            templateSelection: formatState,
        }).change(function (e) {
            chrome.runtime.sendMessage({message: 'setDefaultSearchEngine', engine: e.target.value});
        }).val(defaultSearchEngine).trigger('change');

        $("#useAC").prop('checked', useAC === 'true')
            .change(function () {
                chrome.runtime.sendMessage({message: 'setACSettings', useAC: this.checked ? 'true' : 'false'});
            });

        $("#cookiePermission").prop('checked', cookiePermission === 'true').change(function () {
            console.log('i am here popup')
            const status = this.checked;
            // chrome.runtime.sendMessage({message: 'setCookiePermission', cookiePermission: status ? 'true' : 'false'});
            chrome.permissions.contains({
                permissions: ['cookies'],
                origins: ['https://www.secured-browse.net/*']
            }, function (result) {
                if (result) {
                    if (status) {
                        enableSettingsSection();
                    } else {
                        removeCookiePermission();
                    }
                } else {
                    askCookiePermission();
                }
            });
        });

        if (cookiePermission === 'true') {
            enableSettingsSection();
        }

    });

    engineBtn.on('click', function () {
        engineBtn.toggleClass('open');
        engineWrap.toggleClass('show');
    });

    $('.owl-carousel').owlCarousel({
        loop: true,
        autoplay: true,
        nav: true,
        navText: ["<img src='../img/chevron-left.svg'>", "<img src='../img/chevron-right.svg'>"],
        items: 1,
        dots: false,
    });

    $('.link-footer').on('click', function (e) {
        window.open(`https://${config.domain}/wim/${e.target.id}`);
    });

    $('.learn-more-btn').on('click', () => {
       window.open(config.rootHomePageUrl);
    });

    function removeCookiePermission() {
        chrome.permissions.remove({
            permissions: ['cookies'],
        }, function (removed) {
            if (removed) {
                disableSettingsSection();
            }
        });
    }

    function askCookiePermission() {
        console.log('ask permissions')
        chrome.permissions.request({
            permissions: ['cookies'],
            origins: ['https://www.secured-browse.net/*']
        }, function (granted) {
            console.log('granted: ',granted)
            if (granted) {
                enableSettingsSection();
            } else {
                disableSettingsSection();
            }
        });
    }

    function enableSettingsSection() {
        $("div.tooltip").hover(function () {
            $('.tooltiptext').css("visibility", "hidden");
        });
        $('.setting-wrap').css('opacity', '1');
        $('.setting-select').attr('disabled', false);
        $("#useAC").attr('disabled', false);
        chrome.runtime.sendMessage({message: 'setCookiePermission', cookiePermission: 'true'});
    }

    function disableSettingsSection() {
        $("div.tooltip").hover(function () {
            $('.tooltiptext').css("visibility", "visible");
        });
        $('.setting-select').attr('disabled', true);
        $("#useAC").attr('disabled', true);
        $('.setting-wrap').css('opacity', '0.5');
        chrome.runtime.sendMessage({message: 'setCookiePermission', cookiePermission: 'false'});
    }

    function formatState(state) {
        if (!state.id) {
            return state.text;
        }
        let baseUrl = "/img";
        let $state = $(
            '<span><img src="' + baseUrl + '/' + state.text.toLowerCase() + '.svg" class="img-flag" /> ' + state.text + '</span>'
        );
        return $state;
    }

    function Tabs() {
        let bindAll = function () {
            let menuElements = document.querySelectorAll('[data-tab]');
            for (let i = 0; i < menuElements.length; i++) {
                menuElements[i].addEventListener('click', change, false);
            }
        };

        let clear = function () {
            let menuElements = document.querySelectorAll('[data-tab]');
            for (let i = 0; i < menuElements.length; i++) {
                menuElements[i].classList.remove('active');
                let id = menuElements[i].getAttribute('data-tab');
                let tabs = document.querySelectorAll('[data-tab-content="' + id + '"]');
                for (let j = 0; j < tabs.length; j++) {
                    tabs[j].classList.remove('active');
                }
            }
        };

        let change = function (e) {
            e.preventDefault();
            clear();
            e.target.classList.add('active');
            let id = e.currentTarget.getAttribute('data-tab');
            let tabs = document.querySelectorAll('[data-tab-content="' + id + '"]');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.add('active');
            }
        };

        bindAll();
    }

    let connectTabs = new Tabs();
});
