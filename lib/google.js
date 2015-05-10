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
  create: function(callback) {
    var opts = {
      url: 'https://www.googleapis.com/upload/drive/v2/files?convert=true',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/vnd.google-apps.script+json'
      },
      body: JSON.stringify({
        files: [{
          "name":"Code",
          "type":"server_js",
          "source":"// created via gst"
        }]
      })
    };
    request(opts, function(err, res) {
      callback(err, JSON.parse(res.body));
    });
  },

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

  info: function(projectName, callback) {
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
        callback(err, res.items[0])
      }
    });
  },

  download: function(projectName, callback) {
    this.info(projectName, function(err, project) {
      var url = project.exportLinks['application/vnd.google-apps.script+json'];
      var opts = {
        url: url,
        headers: { 'Authorization': 'Bearer ' + token }
      };
      request(opts, function(err, res) {
        callback(err, JSON.parse(res.body))
      });
    });
  },

  scriptEditorUrl: function(project) {
    return 'https://script.google.com/d/' + project.id + '/edit?usp=drive_web'
  },

  filename: function(file) {
    var ext = ((file.type == 'server_js') ? 'gs' : 'html');
    return file.name + '.' + ext;
  }
}