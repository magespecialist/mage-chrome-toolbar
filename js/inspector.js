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

function inspectItem()
{
    function onSelectionChange(el)
    {
        if (!window.mspDevTools.hasOwnProperty('blocks')) {
            return 'no-data';
        }
        
        var fetchAttr = function (node, attr) {
            while(node) {
                try {
                    var attrValue = node.getAttribute(attr);

                    if (attrValue) {
                        return attrValue;
                    }
                } catch(e) {}

                node = node.parentNode;
            }
        };

        // Block search
        var uiBlockId = fetchAttr(el, 'data-mspdevtools-ui');
        if (uiBlockId) {
            if (!window.mspDevTools['uiComponents'].hasOwnProperty(uiBlockId)) {
                return 'missing';
            }

            if (window.mspDevTools['uiComponents'][uiBlockId]) {
                return window.mspDevTools['uiComponents'][uiBlockId];
            }
        }

        // Block search
        var blockId = fetchAttr(el, 'data-mspdevtools');
        if (blockId) {
            if (!window.mspDevTools['blocks'].hasOwnProperty(blockId)) {
                return 'missing';
            }

            if (window.mspDevTools['blocks'][blockId]) {
                return window.mspDevTools['blocks'][blockId];
            }
        }

        return {};
    }

    chrome.devtools.inspectedWindow.eval('(' + onSelectionChange.toString() + ')($0)', {}, function (res) {
        var phpStormUrl = '';

        if (res == 'missing') {
            $('#inspected-item').css('display', 'none');
            $('#missing-item').css('display', 'block');
        } else if (res == 'no-data') {
            $('#inspected-item').css('display', 'none');
            $('#missing-item').css('display', 'none');
        } else {

          if (res == 'missing') {
            $('#inspected-item').css('display', 'none');
            $('#missing-item').css('display', 'block');
          } else if (res == 'no-data') {
            $('#inspected-item').css('display', 'none');
            $('#missing-item').css('display', 'none');
          } else {
            $('#inspected-item').css('display', 'block');
            $('#missing-item').css('display', 'none');
            $('#inspected-item').html(getFormattedBlockInfo(res));
          }

          $(window).resize();
        }

        $('#phpstorm-link').css('display', phpStormUrl ? 'block' : 'none');
        $('#phpstorm-link').attr('data-phpstorm-url', phpStormUrl);

        $(window).resize();
    });
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
    inspectItem();
});

$(function () {
    inspectItem();

    $('#phpstorm-link').click(function () {
        $.getJSON($(this).attr('data-phpstorm-url'), function(json) {});
    });

    $(window).resize();
});

$(window).resize(function () {
    var $win = $(window);
    $('#inspected-item').css('height', '5px');

    var top = $('#inspected-item').offset().top;
    $('#inspected-item').css('height', ($win.height() - top - 20) + 'px');
});
