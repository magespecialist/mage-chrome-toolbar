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

var port = browser.runtime.connect({name: "content"});

function addDocumentInformation() {
  var blocks = [];

  var markers = document.evaluate('//comment()[contains(., \"START_MSPDEV\[\")]', document, null, XPathResult.ANY_TYPE, null);
  while (true) {
    var startMarker = markers.iterateNext();

    if (startMarker) {
      var endMarkerContent = startMarker.textContent.replace('START_MSPDEV', 'END_MSPDEV').trim();

      var endMarker = document.evaluate('//comment()[contains(., \"' + endMarkerContent + '\")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (endMarker) {
        var m = endMarker.textContent.match(/END_MSPDEV\[(\w+)\]/);
        if (m) {
          var blockId = m[1];
          var section = $(startMarker).nextUntil(endMarker);

          blocks.push({
            'blockId': blockId,
            'section': section
          });
        }
      }
    } else {
      break;
    }
  }

  blocks.forEach(function(block) {
    $(block['section']).attr('data-mspdevtools', block['blockId']);
    $(block['section']).find('*').attr('data-mspdevtools', block['blockId']);
  });
}

function updateDevToolsInformation()
{
  port.postMessage({
    type: 'update',
    to: 'devtools',
    payload: {}
  });
}

window.addEventListener("message", function (event) {
  if (event.source !== window) {
    return;
  }

  // Differential update received
  if (event.data === 'mspDevToolsUpdate') {
    updateDevToolsInformation();
  }
});

$(function () {
  // Parse html comments on page reload
  addDocumentInformation();

  port.postMessage({
    type: 'icon',
    to: 'background',
    payload: $('[data-mspdevtools]').length > 0 ? 'online' : 'offline'
  });

  updateDevToolsInformation();
});
