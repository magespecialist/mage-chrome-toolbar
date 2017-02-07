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

var dataTables = {};

function getRenderedJson(data) {
    return getFormattedBlockInfo(data);
}

function renderPropertyTab(tabId, values)
{
    var $table = $('#panel-' + tabId + ' table');

    if (!dataTables[tabId]) {
        dataTables[tabId] = $table.DataTable({
            paging: false,
            ordering: false,
            searching: false,
            fixedHeader: true,
            dom: 't',
            "columnDefs": [{
                render: function ( data, type, row ) {
                    return '<strong>' + data + '</strong>';
                },
                targets: 0
            }, {
                render: function ( data, type, row ) {
                    return data;
                },
                targets: 1
            }]
        });
    }

    dataTables[tabId].clear();

    for (var i=0; i<values.length; i++) {
        var row = [];
        var value = values[i]['value'];
        row.push(values[i]['label']);

        if (values[i]['type'] == 'complex') {
            var jsonValue = getRenderedJson(value);
            row.push(jsonValue.outerHTML);
        } else if (values[i]['type'] == 'int') {
            row.push(Math.floor(value));
        } else {
            row.push(value);
        }

        dataTables[tabId].row.add(row);
    }

    dataTables[tabId].draw();
}

function renderTableTab(tabId, values)
{
    var $table = $('#panel-' + tabId + ' table');

    var columnDefs = [];
    var columns = [];
    var $colsTd = $('#panel-' + tabId + ' thead tr th');

    if (!dataTables[tabId]) {
        columns.push({
            className: 'show-details',
            orderable: false,
            data: null,
            defaultContent: '<a title="Show Details" class="glyphicon glyphicon-zoom-in"></a>'
        });

        for (var i=0; i<$colsTd.length; i++) {

            var colIndex = $($colsTd[i]).attr('data-index');
            var dataType = $($colsTd[i]).attr('data-type');
            var columnInfo = {data: $($colsTd[i]).attr('data-index')};

            if (!colIndex) {
                continue;
            }

            if (dataType == 'complex') {
                columnDefs.push({
                    render: function ( data, type, full, meta ) {
                        return getRenderedJson(data);
                    },
                    targets: [i]
                });

                columnInfo['orderable'] = false;

            } else if (dataType == 'int') {
                columnDefs.push({
                    render: function ( data, type, full, meta ) {
                        return Math.floor(data);
                    },
                    targets: [i]
                });

            } else if (dataType == 'inspect-block') {
                columnDefs.push({
                    render: function ( data, type, full, meta ) {
                      if (!data) {
                        return '';
                      }

                      return '<a title="Inspect" class="inspect-block" href="' + data + '">'
                        +'<span class="glyphicon glyphicon-eye-open"></span>'
                        +'</a>';
                    },
                    targets: [i]
                });

              columnInfo['className'] = 'icon-column';
              columnInfo['orderable'] = false;

            } else if (dataType == 'inspect-ui-component') {
                columnDefs.push({
                    render: function ( data, type, full, meta ) {
                      if (!data) {
                        return '';
                      }

                      return '<a title="Inspect" class="inspect-ui-component" href="' + data + '">'
                        +'<span class="glyphicon glyphicon-eye-open"></span>'
                        +'</a>';
                    },
                    targets: [i]
                });

              columnInfo['className'] = 'icon-column';
              columnInfo['orderable'] = false;

            } else if (dataType == 'phpstorm') {
                columnDefs.push({
                    render: function ( data, type, full, meta ) {
                        if (!data) {
                            return '';
                        }

                        return '<a title="Open in PhpStorm" class="phpstorm-url" href="' + data + '">'
                                +'<span class="glyphicon glyphicon-file"></span>'
                            +'</a>';
                    },
                    targets: [i]
                });

                columnInfo['orderable'] = false;
                columnInfo['className'] = 'icon-column';
            }

            columns.push(columnInfo);
        }

        columnDefs.push({ targets: '_all', type: "natural" });

        dataTables[tabId] = $table.DataTable({
            paging: false,
            dom: 'ft',
            columns: columns,
            columnDefs: columnDefs,
            scrollY: "100px"
        });

        $('#panel-' + tabId + ' tbody').on('click', '.show-details', function (e) {
            var tr = $(this);
            var row = dataTables[tabId].row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                var rowData = row.data();
                row.child(getRenderedJson(rowData)).show();
                tr.addClass('shown');
            }
        });
    }

    dataTables[tabId].clear()

    for (var key in values) {
        var rowValues = values[key];
        dataTables[tabId].row.add(rowValues);
    }

    dataTables[tabId].draw();

    $('#panel-' + tabId + ' a.phpstorm-url').click(function (e) {
        e.preventDefault();
        $.getJSON($(this).attr('href'), function(json) {});
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
}

function setRunlevel(level)
{
    $('.runlevel').css('display', 'none');
    $('#runlevel-' + level).css('display', 'block');
}

var port = chrome.runtime.connect({
    name: "pageinfo:" + chrome.devtools.inspectedWindow.tabId
});
port.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.tabId == chrome.devtools.inspectedWindow.tabId) {

        if (msg.type == 'update') {
            if (msg.payload) {
                if (!$.isEmptyObject(msg.payload['blocks'])) {
                    setRunlevel('online');

                    $('.mage-v1').css('display', 'none');
                    $('.mage-v2').css('display', 'none');

                    if (msg.payload['version'] == 1) {
                        $('.mage-v1').css('display', 'block');
                    } else if (msg.payload['version'] == 2) {
                        $('.mage-v2').css('display', 'block');
                    }

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

$(function () {
    port.postMessage({
        tabId: chrome.devtools.inspectedWindow.tabId,
        to: 'devtools',
        type: 'update',
        payload: {}
    });

    setRunlevel('reload');

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
