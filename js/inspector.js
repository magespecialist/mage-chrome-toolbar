/**
 * MageSpecialist
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to info@magespecialist.it so we can send you a copy immediately.
 *
 * @category   MSP
 * @package    MSP_DevTools
 * @copyright  Copyright (c) 2017 Skeeller srl (http://www.magespecialist.it)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

function onItemInspected() {
  function onSelectionChange(el) {
    if (!window.mspDevTools.hasOwnProperty('blocks')) {
      return 'no-data';
    }

    // Locate nearest parent with msp devtools info
    var fetchAttr = function (node, attr) {
      while (node) {
        try {
          var attrValue = node.getAttribute(attr);

          if (attrValue) {
            return attrValue;
          }
        } catch (e) {
        }

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

  browser.devtools.inspectedWindow.eval('(' + onSelectionChange.toString() + ')($0)', {}, function (res) {
    $('#inspected').css('display', 'none');
    $('#missing').css('display', 'none');
    $('#no-data').css('display', 'none');

    if (res === 'no-data') {
      $('#no-data').css('display', 'block');
    } else if (res === 'missing') {
      $('#missing').css('display', 'block');
    } else {
      $('#inspected').css('display', 'block');
      $('#inspected').html(getBlockInfo(res));
      $('.phpstormlink').click(function(e) {
          e.preventDefault();
          fetch(e.target.href);
      })
    }
  });
}

browser.devtools.panels.elements.onSelectionChanged.addListener(function () {
  onItemInspected();
});

onItemInspected();
