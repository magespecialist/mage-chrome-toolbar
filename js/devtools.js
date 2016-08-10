/**
 * IDEALIAGroup srl
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to info@idealiagroup.com so we can send you a copy immediately.
 *
 * @category   MSP
 * @package    MSP_DevTools
 * @copyright  Copyright (c) 2016 IDEALIAGroup srl (http://www.idealiagroup.com)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

var port = chrome.runtime.connect({
    name: "devtools:" + chrome.devtools.inspectedWindow.tabId
});

chrome.devtools.panels.create(
	"Magento",
    null,
    "panel/panel.html",
    null
);

function sendUpdate()
{
    function onUpdateMessage() {
        return window.mspDevTools;
    }

    chrome.devtools.inspectedWindow.eval('(' + onUpdateMessage.toString() + ')()', {}, function (res) {
        var tabId = chrome.devtools.inspectedWindow.tabId;

        port.postMessage({
            tabId: tabId,
            type: 'update',
            to: 'pageinfo',
            payload: res
        });
    });
}

port.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.tabId == chrome.devtools.inspectedWindow.tabId) {
        if (msg.type == 'update') {
            sendUpdate();

        }
    }
});

chrome.devtools.panels.elements.createSidebarPane(
	"Magento",
	function (sidebar) {
        sidebar.setPage('inspector.html');
	}
);
