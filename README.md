# Magento Chrome Toolbar for MSP DevTools

**Magento Chrome Toolbar** is a chrome extension to be used with **MSP_DevTools** for **Magento 1** or **Magento 2**.

This extension allows you to **quickly access** the information you need to debug your Magento performances,
to build your new theme or to modify an existing one.

## How can I install it?
You can both download it from here or simpy visit the **[Chrome WebStore][1]**

> Before you can use this extension on any Magento website, you need to install MSP_DevTools for Magento 1 or for Magento 2.

### Installing on Magento 2:
* Quick way: `composer install msp/devtools`
* Long way: Download package from GitHub: https://github.com/magespecialist/m2-MSP_DevTools

> Remember to enable it from Magento Backend

## How does it work?
You can access both **Global Page Information** and **Item Information** through **Chrome Inspector**.

### Global Page Information
From the main panel you can see information from:

* Theme
* Controller / Router
* Request parameters
* Layout and Layout updates
* Observers
* Blocks, Containers, uiComponents
* Profiler

#### Theme, Controller and Global information: 
<img src="https://raw.githubusercontent.com/magespecialist/mage-chrome-toolbar/master/screenshots/1.png" width="480" />

#### Blocks / Containers information:
<img src="https://raw.githubusercontent.com/magespecialist/mage-chrome-toolbar/master/screenshots/2.png" width="480" />

#### uiComponents information:
<img src="https://raw.githubusercontent.com/magespecialist/mage-chrome-toolbar/master/screenshots/3.png" width="480" />

#### Profiler information:
<img src="https://raw.githubusercontent.com/magespecialist/mage-chrome-toolbar/master/screenshots/5.png" width="480" />

### Item Information
Magento Chrome Toolbar is integrated woth Chrome Inspector.

By selecting an item in you page you can see:

* Block information
* Used template
* Server elapsed time
* Block nesting
* Template file
* Cache information
* uiComponent information
* Container information

#### Inspector integration
<img src="https://raw.githubusercontent.com/magespecialist/mage-chrome-toolbar/master/screenshots/main2.png" width="480" />

### PhpStorm Integration
Magento Chrome Toolbar can be integrated with **PhpStorm** to directly open the template file you wish to edit.

> You need to install **Remote Call Plugin** in PhpStorm and enable the feature from Magento Backend.


[1]: https://chrome.google.com/webstore/detail/magespecialist-devtools-f/odbnbnenehdodpnebgldhhmicbnlmapj?authuser=3
