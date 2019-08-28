/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
function parse(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = { };
  if (json){
    profile.id = json.referenceCode;
    profile.username = json.username;
    profile.membershipLevelId = json.membershipLevelId;
    profile.avatarUrl = json.avatarUrl;
    profile.findCount = json.findCount;
    profile.hideCount = json.hideCount;
    profile.favoritePoints = json.favoritePoints;
    profile.profileText = json.profileText;
  }

  return profile;
};
// exports.parse = parse;

export default {
  parse
}