"use strict";

var collectify = require("./util/collectify");

var _require = require("./util/string");

var jsify = _require.jsify;
var downcaseFirst = _require.downcaseFirst;

function base(resp) {
  var data = resp.resultSets[0];
  var headers = data.headers.map(jsify);
  return collectify(headers, data.rowSet);
}

function general(resp) {
  return resp.resultSets.reduce(function (ret, set) {
    var name = downcaseFirst(set.name);
    ret[name] = collectify(set.headers.map(jsify), set.rowSet);
    return ret;
  }, {});
}

function players(resp) {
  return base(resp).map(function (player) {
    var names = player.displayLastCommaFirst.split(", ").reverse();
    return {
      firstName: names[0].trim(),
      lastName: (names[1] ? names[1] : "").trim(),
      playerId: player.personId
    };
  });
}

module.exports = {
  base: base,
  general: general,
  players: players
};