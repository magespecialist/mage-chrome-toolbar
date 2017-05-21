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

function getPhpStormLinks(data) {
  var phpStormLinks = data['phpstorm_links'];
  var $phpStormLinks = false;

  if (phpStormLinks && phpStormLinks.length) {
    $phpStormLinks = $('<div></div>').addClass('phpstorm-links');
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

function renderBlockProperty(k, data) {
  var $res = $('<span></span>');

  if (Object.prototype.toString.call(data) === '[object Array]') {
    var $ul = $('<ul></ul>');
    for (var i = 0; i < data.length; i++) {
      var $li = $('<li></li>');
      $li.append(renderBlockProperty(k, data[i]));
      $ul.append($li);
    }
    $res.append($ul);

  } else if (Object.prototype.toString.call(data) === '[object Object]') {
    var $dl = $('<div></div>').addClass('definition-list');
    Object.keys(data).forEach(function (k2) {
      var $dr = $('<div></div>').addClass('definition-row');
      var $dt = $('<div></div>').addClass('definition-term');
      var $dd = $('<div></div>').addClass('definition-data');

      $dt.text(k2);
      $dd.append(renderBlockProperty(k, data[k2]));

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

function getPerformanceProperties(data) {
  var allowedFields = ['time', 'proper_time', 'count'];

  var $blockInfo = $('<div></div>').addClass('block-performance');
  $blockInfo.append($('<h4></h4>').text('Block Performance'));

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

  $blockInfo.append(renderBlockProperty('_performance', data2));

  return $blockInfo;
}

function getBlockMain(data) {
  var allowedFields = ['name', 'type', 'class', 'file', 'template', 'module', 'cms_block_id', 'component'];

  var $blockInfo = $('<div></div>').addClass('block-main');
  $blockInfo.append($('<h4></h4>').text('Main Block Information'));

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

  $blockInfo.append(renderBlockProperty('_main', data2));

  return $blockInfo;
}

function getExtraProperties(data) {
  if (!Object.keys(data).length) {
    return false;
  }

  var $blockInfo = $('<div></div>').addClass('block-extra');

  $blockInfo.append($('<h4></h4>').text('Extra Properties'));
  $blockInfo.append(renderBlockProperty('_extra', data));

  return $blockInfo;
}

function getBlockInfo(data) {
  var data2 = Object.assign({}, data);

  if (!Object.keys(data2).length) {
    return null;
  }

  var $main = getBlockMain(data2);
  var $phpStorm = getPhpStormLinks(data2);
  var $performance = getPerformanceProperties(data2);
  var $extra = getExtraProperties(data2);

  var $div = $('<div></div>');
  $div.append($main);

  if ($phpStorm) {
    $div.append($phpStorm);
  }

  if ($performance) {
    $div.append($performance);
  }

  if ($extra) {
    $div.append($extra);
  }

  return $div[0];
}
