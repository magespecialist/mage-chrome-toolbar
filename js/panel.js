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

var dataTables = {};

var port = chrome.runtime.connect({
  name: "panel:" + chrome.devtools.inspectedWindow.tabId
});
port.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.tabId === chrome.devtools.inspectedWindow.tabId) {
    if (msg.type === 'update') {
      if (msg.payload) {
        if (!$.isEmptyObject(msg.payload['blocks'])) {
          setRunlevel('online');

          $('.mage-v1').css('display', 'none');
          $('.mage-v2').css('display', 'none');

          if (msg.payload['version'] === 1) {
            $('.mage-v1').css('display', 'block');
          } else if (msg.payload['version'] === 2) {
            $('.mage-v2').css('display', 'block');
          }

          $('#mage-v2-query-profiler-warning').css('display',
            (!msg.payload['queries'] || !msg.payload['queries'].length) ?
              'block' : 'none'
          );

          renderPropertyTab('general', msg.payload['general']);
          renderPropertyTab('design', msg.payload['design']);
          renderTableTab('events', msg.payload['events']);
          renderTableTab('blocks', msg.payload['blocks']);
          renderTableTab('ui-components', msg.payload['uiComponents']);
          renderTableTab('profiler', msg.payload['profiler']);
          renderTableTab('logs', msg.payload['profiler']);
          renderTableTab('plugins', msg.payload['plugins']);
          renderTableTab('queries', msg.payload['queries']);
        } else {
          setRunlevel('fpc');
        }
      } else {
        setRunlevel('no-mage');
      }
    }
  }
});

function setRunlevel(level) {
  $('.runlevel').css('display', 'none');
  $('#runlevel-' + level).css('display', 'block');
}

function renderPropertyTab(tabId, values) {
  $('#panel-' + tabId + ' .property').html(renderPropertyOptions(values)[0].outerHTML);
}

function renderTableTab(tabId, values) {
  var columns = [];
  var colsInfo = {};
  var rows = [];

  var $colsTd = $('#panel-' + tabId + ' thead tr th');

  for (var i = 0; i < $colsTd.length; i++) {
    var colIndex = $($colsTd[i]).attr('data-index');
    var dataType = $($colsTd[i]).attr('data-type');
    var dataWidth = $($colsTd[i]).attr('data-width');
    var dataIcon = $($colsTd[i]).attr('data-icon');
    var dataExplode = $($colsTd[i]).attr('data-explode');
    var label = $($colsTd[i]).html();

    if (!dataWidth) {
      dataWidth = 0;
    }

    if (!colIndex) {
      continue;
    }

    colsInfo[colIndex] = {
      'type': dataType,
      'icon': !!dataIcon,
      'explode': !!dataExplode,
    };

    var style = {
      'overflow': 'hidden',
      'textOverflow': 'ellipsis',
      'wordBreak': 'keep-all',
      'whiteSpace': 'nowrap',
      'width': dataWidth,
      'maxWidth': dataWidth,
      'textAlign': (dataType === 'int') ? 'right' : 'left',
      'vertical-align': 'middle'
    };

    if (dataIcon) {
      style['padding-left'] = '4px';
      style['padding-right'] = '4px';
      style['width'] = '30px';
      style['maxWidth'] = '30px';
    }

    columns.push({
      'name': colIndex,
      'title': label,
      'filterable': !dataIcon,
      'sortable': !dataIcon,
      'style': style
    });
  }

  Object.keys(values).forEach(function (k) {
    var row = {};

    columns.forEach(function (col) {
      var val = values[k][col['name']];
      var colType = colsInfo[col['name']]['type'];
      var colIcon = colsInfo[col['name']]['icon'];
      var colExplode = colsInfo[col['name']]['explode'];

      if (colExplode) {
        var $link = $('<a></a>')
          .attr('title', 'Show details')
          .attr('href', '#')
          .attr('data-details', JSON.stringify(values[k]))
          .addClass('show-details')
          .html(val);

        val = $link[0].outerHTML;
      }

      if (colIcon && val) {
        if (colType === 'phpstorm') {
          val = '<a title="Open in PhpStorm" class="phpstorm-url" href="' + val + '">'
            + '<span class="glyphicon glyphicon-file"></span>'
            + '</a>';
        } else if (colType === 'inspect-block') {
          val = '<a title="Find in DOM" class="inspect-block" href="' + val + '">'
            + '<span class="glyphicon glyphicon-eye-open"></span>'
            + '</a>';
        } else if (colType === 'inspect-ui-component') {
          val = '<a title="Find in DOM" class="inspect-ui-component" href="' + val + '">'
            + '<span class="glyphicon glyphicon-eye-open"></span>'
            + '</a>';
        }
      }

      row[col['name']] = val;
    });

    rows.push(row);
  });

  if (!dataTables.hasOwnProperty(tabId)) {
    dataTables[tabId] = FooTable.init('#panel-' + tabId + ' table', {
      "columns": columns
    });
  }

  dataTables[tabId].rows.load(rows);

  $('#panel-' + tabId + ' a.phpstorm-url').click(function (e) {
    e.preventDefault();
    $.getJSON($(this).attr('href'), function (json) {
    });
  });

  $('#panel-' + tabId + ' a.inspect-block').click(function (e) {
    e.preventDefault();
    var blockId = $(this).attr('href');
    chrome.devtools.inspectedWindow.eval("inspect(jQuery('[data-mspdevtools=" + blockId + "]')[0])");
  });

  $('#panel-' + tabId + ' a.inspect-ui-component').click(function (e) {
    e.preventDefault();
    var blockId = $(this).attr('href');
    chrome.devtools.inspectedWindow.eval("inspect(jQuery('[data-mspdevtools-ui=" + blockId + "]')[0])");
  });

  $('#panel-' + tabId + ' a.show-details').click(function (e) {
    e.preventDefault();
    var details = JSON.parse($(e.target).attr('data-details'));
    bootbox.alert({
      'message': getBlockInfo(details, 'compact').outerHTML,
      'backdrop': true
    });
  });
}

$(function () {
  port.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    to: 'devtools',
    type: 'update',
    payload: {}
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var tabId = $(e.target).attr('href').replace('#panel-', '');

    if (dataTables[tabId]) {
      dataTables[tabId].draw();
    }

    $(window).resize();
  });

  $(window).resize(function () {
    $('.dataTables_scrollBody').each(function () {
      var $me = $(this);
      var $win = $(window);

      $me.css('height', '5px');

      var top = $me.offset().top;
      $me.css('height', ($win.height() - top - 30) + 'px');
    });
  });
});