var google = require('googleapis');
var request = require('request');

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
  },

  download: function(projectName, callback) {
    var params = {
      q: "title='" + projectName + "' and mimeType='application/vnd.google-apps.script' and 'me' in owners"
    };
    drive.files.list(params, function(err, res) {
      if (err) {
        console.error(err);
      }
      else if (res.items.length == 0) {
        console.error('Project not found: ' + projectName);
      }
      else {
        var url = res.items[0].exportLinks['application/vnd.google-apps.script+json'];
        var opts = {
          url: url,
          headers: { 'Authorization': 'Bearer ' + token }
        };
        request(opts, function(err, res) {
          callback(err, JSON.parse(res.body))
        });
      }
    })
  },

  filename: function(file) {
    var ext = ((file.type == 'server_js') ? 'gs' : 'html');
    return file.name + '.' + ext;
  }
}