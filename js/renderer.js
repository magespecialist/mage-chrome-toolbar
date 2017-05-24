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

function renderPropertyOptions(data) {
  var flattenProperty = {};

  for (var i=0; i<data.length; i++) {
    flattenProperty[data[i]['label']] = data[i]['value'];
  }

  return renderProperty(flattenProperty);
}

function renderProperty(data) {
  var $res = $('<span></span>').addClass('rendered-property');

  if (Object.prototype.toString.call(data) === '[object Array]') {
    var $ul = $('<ul></ul>');
    for (var i = 0; i < data.length; i++) {
      var $li = $('<li></li>');
      $li.append(renderProperty(data[i]));
      $ul.append($li);
    }
    $res.append($ul);

  } else if (Object.prototype.toString.call(data) === '[object Object]') {
    var $dl = $('<div></div>').addClass('definition-list');
    Object.keys(data).forEach(function (k) {
      var $dr = $('<div></div>').addClass('definition-row');
      var $dt = $('<div></div>').addClass('definition-term');
      var $dd = $('<div></div>').addClass('definition-data');

      $dt.text(k);
      $dd.append(renderProperty(data[k]));

      $dr.append($dt);
      $dr.append($dd);

      $dl.append($dr);
    });

    $res.append($dl);
  } else {

    $res.addClass('string');
    $res.text(data);
  }

  return $res;
}

function getPhpStormLinks(data) {
  var phpStormLinks = data['phpstorm_links'];
  var $phpStormLinks = false;

  if (phpStormLinks && phpStormLinks.length) {
    $phpStormLinks = $('<div></div>').addClass('phpstorm-links').addClass('rendered-property');
    var $dl = $('<div></div>').addClass('definition-list');

    $phpStormLinks.append($('<h4></h4>').text('PhpStorm Shortcuts'));
    $phpStormLinks.append($dl);

    for (var i = 0; i < phpStormLinks.length; i++) {
      var $link = $('<a></a>')
        .attr('href', phpStormLinks[i]['link'])
        .text(phpStormLinks[i]['file']);

      var $dr = $('<div></div>').addClass('definition-row');
      var $dd = $('<div></div>').addClass('definition-data');

      $dd.append($link);
      $dr.append($('<div></div>').addClass('definition-term').text(phpStormLinks[i]['key']));
      $dr.append($dd);

      $dl.append($dr);
    }
  }

  delete data['id'];
  delete data['phpstorm_url'];
  delete data['phpstorm_links'];

  return $phpStormLinks;
}

function getPerformanceProperties(data) {
  var allowedFields = ['time', 'proper_time', 'count'];

  var $blockInfo = $('<div></div>').addClass('block-performance');
  $blockInfo.append($('<h4></h4>').text('Performance'));

  var data2 = {};
  allowedFields.forEach(function (k) {
    if (data.hasOwnProperty(k)) {
      data2[k] = data[k];
      delete data[k];
    }
  });

  if (!Object.keys(data2).length) {
    return false;
  }

  $blockInfo.append(renderProperty(data2));

  return $blockInfo;
}

function getBlockMain(data) {
  var allowedFields = ['name', 'type', 'class', 'class_method', 'plugins', 'template', 'module', 'cms_block_id', 'component', 'sql', 'grade'];

  var $blockInfo = $('<div></div>').addClass('block-main');
  $blockInfo.append($('<h4></h4>').text('Main Information'));

  var data2 = {};
  allowedFields.forEach(function (k) {
    if (data.hasOwnProperty(k)) {
      data2[k] = data[k];
      delete data[k];
    }
  });

  if (!Object.keys(data2).length) {
    return false;
  }

  $blockInfo.append(renderProperty(data2));

  return $blockInfo;
}

function getExtraProperties(data) {
  if (!Object.keys(data).length) {
    return false;
  }

  var $blockInfo = $('<div></div>').addClass('block-extra');

  $blockInfo.append($('<h4></h4>').text('Extra Properties'));
  $blockInfo.append(renderProperty(data));

  return $blockInfo;
}

function getBlockInfo(data, customClass) {
  var data2 = Object.assign({}, data);

  if (!Object.keys(data2).length) {
    return null;
  }

  var $main = getBlockMain(data2);
  var $phpStorm = getPhpStormLinks(data2);
  var $performance = getPerformanceProperties(data2);
  var $extra = getExtraProperties(data2);

  var $div = $('<div></div>');
  if (customClass) {
    $div.addClass(customClass);
  }

  if ($phpStorm) {
    $div.append($phpStorm);
  }

  $div.append($main);

  if ($performance) {
    $div.append($performance);
  }

  if ($extra) {
    $div.append($extra);
  }

  return $div[0];
}
