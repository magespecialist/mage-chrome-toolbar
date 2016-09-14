# Magento Chrome Toolbar for MSP DevTools

**Magento Chrome Toolbar** is a chrome extension to be used with **MSP_DevTools** for **Magento 1** or **Magento 2**.

This extension allows you to **quickly access** the information you need to debug your Magento performances,
to build your new theme or to modify an existing one.

## How can I install it?
Just install from **[Chrome WebStore][1]**.
Now you have the Chrome extension, next step is to install and configure the **Magento extension**. 

### Installing on Magento 1:
* Download and unzip in the Magento root: https://github.com/magespecialist/m1-MSP_DevTools/archive/master.zip.
* Flush your cache.
* Open Magento backend and go to `System > Configuration > MageSpecialist > DevTools`.
* Enable devtools and set IP restrictions.
* Optionally download PhpStorm **Remote Call Plugin** if you wish to integrate PhpStorm.
 
This package is also available on **packagist** for Magento 1 composer installation: `composer require msp/devtools-m1`

> Source code available on GitHub: https://github.com/magespecialist/m1-MSP_DevTools

### Installing on Magento 2:
* From your CLI run: `composer require msp/devtools`
* Flush your cache.
* Turn OFF **Full Page Cache** while you are using DevTools.
* Open Magento backend and go to `Store > Configuration > MageSpecialist > DevTools`.
* Enable devtools and set IP restrictions.
* Optionally download PhpStorm **Remote Call Plugin** if you wish to integrate PhpStorm.

> Source code available on GitHub: https://github.com/magespecialist/m2-MSP_DevTools

#### Enabling profiler feature on Magento 2:
If you wish to enable the profiler feature you need to set the `MAGE_PROFILER` server variable to `MSP\DevTools\Profiler\Driver\Standard\Output\DevTools`.
You can do it in several ways:

##### Editing `index.php`:
Add the following line at the very beginning on `index.php` file:

`$_SERVER['MAGE_PROFILER']='MSP\DevTools\Profiler\Driver\Standard\Output\DevTools';`
 
##### Editing `.htaccess` file
Add the following line to your `.haccess` file:

`SetEnv MAGE_PROFILER MSP\DevTools\Profiler\Driver\Standard\Output\DevTools`

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

> You need to install **Remote Call Plugin** in PhpStorm, then enable the feature from Magento Backend.


[1]: https://chrome.google.com/webstore/detail/magespecialist-devtools-f/odbnbnenehdodpnebgldhhmicbnlmapj?authuser=3
