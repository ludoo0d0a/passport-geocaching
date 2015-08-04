/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = { };
  if (json.Profile && json.Profile.User){
    profile.id = json.Profile.User.Id;
    profile.username = json.Profile.User.UserName;
    profile.MemberType = json.Profile.User.MemberType.MemberTypeName;
    profile.AvatarUrl = json.Profile.User.AvatarUrl;
    profile.FindCount = json.Profile.User.FindCount;
    profile.HideCount = json.Profile.User.HideCount;
    profile.PublicGuid = json.Profile.User.PublicGuid;
  }

  return profile;
};
