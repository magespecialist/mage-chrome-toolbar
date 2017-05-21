function getFormattedBlockInfo(data) {
  var data2 = data;

  var phpStormLinks = data['phpstorm_links'];
  var $phpStormLinks = null;

  if (phpStormLinks && phpStormLinks.length) {
    $phpStormLinks = $('<div></div>').addClass('phpstorm-links');
    var $dl = $('<dl></dl>');

    $phpStormLinks.append($('<h4></h4>').text('PhpStorm Shortcuts'));
    $phpStormLinks.append($dl);

    for (var i = 0; i < phpStormLinks.length; i++) {
      var $link = $('<a></a>')
        .attr('href', phpStormLinks[i]['link'])
        .text(phpStormLinks[i]['file']);

      var $dd = $('<dd></dd>');
      $dd.append($link);

      $dl.append($('<dt></dt>').text(phpStormLinks[i]['key']));
      $dl.append($dd);
    }
  }

  delete data2['id'];
  delete data2['phpstorm_url'];
  delete data2['phpstorm_links'];

  var $div = $('<div></div>');
  if ($phpStormLinks) {
    $div.append($phpStormLinks);
  }
  $div.append(new JSONFormatter(data2).render());

  return $div[0];
}