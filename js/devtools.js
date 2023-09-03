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


var port = browser.runtime.connect({
  name: "devtools:" + browser.devtools.inspectedWindow.tabId
});
// alert(port);
function updateDevToolsInformation() {
  function onUpdateMessage() {
    return window.mspDevTools;
  }

  browser.devtools.inspectedWindow.eval('(' + onUpdateMessage.toString() + ')()', {}, function (res) {
    var tabId = browser.devtools.inspectedWindow.tabId;

    port.postMessage({
      tabId: tabId,
      type: 'update',
      to: 'panel',
      payload: res
    });
  });
}

browser.devtools.panels.create(
  "Magento",
  'images/icon.png',
  "/panel/panel.html"
);

browser.devtools.panels.elements.createSidebarPane(
  "Magento",
  function (sidebar) {
    sidebar.setPage('inspector.html');
  }
);

port.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.tabId === browser.devtools.inspectedWindow.tabId) {
    if (msg.type === 'update') {
      updateDevToolsInformation();
    }
  }
});

updateDevToolsInformation();
