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

var port = chrome.runtime.connect({name: "content"});
var updateTimeout;

function pingForUpdate()
{
    port.postMessage({
        type: 'update',
        to: 'devtools',
        payload: {}
    });
}

function addDocumentInformation()
{
    var blocksStack = [];
    $('*').each(function(i, e) {
        // This avoids security exceptions with iframes

        try {
            $(this).contents().each(function (i, e) {
                if (this.nodeType == 8) {
                    var nodeValue = this.nodeValue;
                    var m = nodeValue.match(/\s*(\/?)MSPDEVTOOLS\[(\w+)\]\s*/);

                    if (m) {
                        var close = m[1];
                        var blockId = m[2];

                        if (close) {
                            blocksStack.pop();
                        } else {
                            blocksStack.push(blockId);
                        }
                    }
                } else if (this.nodeType == 1) {
                    if (blocksStack.length > 0) {
                        blockId = blocksStack[blocksStack.length - 1];
                        $(this).attr('data-mspdevtools', blockId);
                    }
                }
            });
        } catch (e) {}
    });
}

port.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.type == 'decorateDom') {
        addDocumentInformation();

        port.postMessage({
            type: 'icon',
            to: 'background',
            payload: $('[data-mspdevtools]').length > 0 ? 'online' : 'offline'
        });
    }
});

$(function () {
    pingForUpdate();
});

window.addEventListener("message", function(event) {
    if (event.source != window) {
        return;
    }

    if (event.data == 'mspDevToolsUpdate') {
        if (updateTimeout) {
            window.clearTimeout(updateTimeout);
        }

        updateTimeout = window.setTimeout(function () {
            pingForUpdate();
            updateTimeout = null;
        }, 100);

    }
}, false);
