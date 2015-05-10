# GSTame

Node library and command-line tool to help developers maintain [Google Apps Script](https://developers.google.com/apps-script) projects.

## Command-line

Install it with npm:

```
$ npm install -g gstame
```

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
$ gstame pull Project1
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

More than offering a command line tool, I'd like to enable *real* local development of Google Apps Script using Node.js stubs.

For instance, take this typical `Code.gs` file:

```js
function onInstall(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Export', 'showExportMarkdown')
    .addItem('Import', 'showImportMarkdown')
    .addToUi();
}
```

With the right stubs immitating Google elements and ui, you could test your `gs` with your favorite Node testing tools:

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

Talking about node packages, it should be possible to allow developers to define Node dependencies for their `gs` code using npm, and have these bundled/compiled to something that Google can execute on `push`.

Please let me know if you have any feedback on these!
