/**
 * Juan Escobar (https://github.com/itseco)
 *
 * @link      https://github.com/itseco/to-google-translate
 * @copyright Copyright (c) 2017, Juan Escobar.  All rights reserved.
 * @license   Copyrights licensed under the New BSD License.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


new Config(true, items => {

    let {pageLang, userLang, ttsLang, tpPageLang, tpUserLang, enableTT, enableTTS, enableTP} = items;

    chrome.contextMenus.removeAll(function () {
        // create Translate context menu
        if (enableTT) {
            chrome.contextMenus.create({
                id: 'translate',
                title: chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang, userLang]),
                contexts: ['selection']
            });
        }
        // create Listen context menu
        if (enableTTS) {
            chrome.contextMenus.create({
                id: 'tts',
                title: chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang),
                contexts: ['selection']
            });
        }
        // create Translate Page context menu
        if (enableTP) {
            chrome.contextMenus.create({
                id: 'translatePage',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePage', [tpPageLang, tpUserLang]),
                contexts: ['all']
            });

            chrome.contextMenus.create({
                id: 'translatePageLink',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePageLink', [tpPageLang, tpUserLang]),
                contexts: ['link']
            });
        }
    });
});

// manage click context menu
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let selectedText = info.selectionText;
    let config = Config.config;

    switch (info.menuItemId) {
        case 'translate':
            tabCreateWithOpenerTabId(config.translateURL + encodeURIComponent(selectedText), tab);
            break;
        case  'tts':
            tabCreateWithOpenerTabId(config.ttsURL + encodeURIComponent(selectedText) + '&textlen=' + selectedText.length, tab);
            break;
        case 'translatePage':
            tabCreateWithOpenerTabId(config.translatePageURL + encodeURIComponent(info.pageUrl), tab);
            break;
        case 'translatePageLink':
            tabCreateWithOpenerTabId(config.translatePageURL + encodeURIComponent(info.linkUrl), tab);
            break;
    }
});

chrome.runtime.onInstalled.addListener(function (info) {
    if (info.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

// Create a tab with openerTabId if version of Firefox is above 57
// https://github.com/itsecurityco/to-google-translate/pull/19
function tabCreateWithOpenerTabId(uri, tab) {
    browser.runtime.getBrowserInfo().then(info => {
        let newTabConfig = {
            url: uri
        };
        if (Math.round(parseInt(info.version)) > 56) {
            // openerTabId supported
            newTabConfig.openerTabId = tab.id;
        }
        chrome.tabs.create(newTabConfig);
    });
}