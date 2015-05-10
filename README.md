# GSTame

Node library and command-line tool to help developers maintain [Google Apps Script](https://developers.google.com/apps-script) projects.

## Command-line

Start authenticating to grab a token to your Google Drive:

```
$ gstame auth
```

You can then create a new Apps Script project in your Drive account:

```
$ gstame create
```

Then list projects in your account:

```
$ gstame list
Project1
Project2
```

To save a project to the current folder like:

```
$ gstame pull Project1`
Wrote Dialog.html
Wrote DialogJavaScript.html
Wrote Sidebar.html
Wrote Stylesheet.html
Wrote SidebarJavaScript.html
Wrote Code.gs
```

Modify it locally, and push back!

```
$ gstame push Project1
Updated Stylesheet.html
Updated Code.gs
Updated Dialog.html
Updated DialogJavaScript.html
Updated Sidebar.html
Updated SidebarJavaScript.html
```

Open projects in Script Editor to rename, publish, etc:

```
$ gstame open Project1
```

## Future

The command-line is just part of the problem I'd like to tackle here.

Better than allowing developers to sync projects, I'd like to allow for real local development of Google Script using Node stubs.

For instance, take this typical .gs code:

```js
function onInstall(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Export', 'showExportMarkdown')
    .addItem('Import', 'showImportMarkdown')
    .addToUi();
}
```

I'd like to wrap it with Node stubs immitating the Google elements so we can do things like:

```js
var assert = require('chai').assert;
var myProject = require('Code.gs');
var DocumentApp = require('gstame').stub(myProject);

describe('Installation', function() {
  it ('Adds two new items to the Add-ons menu', function() {
    assert.equal(2, DocumentApp.getUi().getAddonMenu().items.length);
  });
});
```

I'd also like to allow for Node dependencies in Node, so you can essentially define a `package.json` for your Apps Script, and have it all "compile" to code that Google can execute.
