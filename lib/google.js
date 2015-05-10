var google = require('googleapis');
var drive = google.drive('v2');

var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2();

var fs = require('fs');
var token = fs.readFileSync(process.env.HOME + '/.gs-tamer','utf8')
oauth2Client.setCredentials({ access_token: token });
google.options({ auth: oauth2Client });

module.exports = {
  list: function(callback) {
    var params = {
      q: "mimeType='application/vnd.google-apps.script' and 'me' in owners"
    };

    drive.files.list(params, function(err, res) {
      if (err) {
        console.error(err);
      }
      callback(res.items);
    });
  }
}