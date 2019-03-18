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

var mspPorts = {};

browser.runtime.onConnect.addListener(function (port) {
  var portName = port.name;
  var tabId = 0;

  if (portName.indexOf(':') === -1) {
    if (port.sender.tab && port.sender.tab.id) {
      tabId = port.sender.tab.id;
    }

    portName = portName + ':' + tabId;
  }

  console.log("Connected: " + portName);

  mspPorts[portName] = port;

  // Message forwarding
  port.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg.tabId && sender.sender.tab) {
      msg.tabId = sender.sender.tab.id;
    }

    if (!msg.tabId) {
      msg.tabId = 0;
    }

    if (msg.to === 'background') {
      console.log("Message for " + msg.to + "(" + msg.tabId + "): " + msg.type);

      if (msg.type === 'icon') {
        console.log("Icon: " + msg.payload);

        if (msg.payload === 'online') {
          browser.browserAction.setIcon({path: "images/icon.png", tabId: msg.tabId});
        } else {
          browser.browserAction.setIcon({path: "images/icon_off.png", tabId: msg.tabId});
        }
      }

    } else {
      // Forward message
      sendMessage(msg);
    }
  });

  port.onDisconnect.addListener(function () {
    console.log("Disconnected: " + portName);
    mspPorts[portName] = null;
  });
});

function sendMessage(msg) {
  var portName = msg.to + ':' + msg.tabId;

  console.log("Message for " + msg.to + "(" + msg.tabId + "): " + msg.type);

  if (mspPorts[portName]) {
    mspPorts[portName].postMessage(msg);
  } else {
    console.log(msg.to + " is not defined");
  }
}
