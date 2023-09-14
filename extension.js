// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { TreeData, TreeItem, openUrl, addUrl, removeUrl } = require("./utils");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let config = vscode.workspace.getConfiguration("quickLink");
  const treeData = new TreeData();

  treeData.root.children = config.siteList.map(
    ([name, url]) => new TreeItem(name, url)
  );

  const tree = vscode.window.registerTreeDataProvider("quickLink", treeData);

  context.subscriptions.push(tree);

  context.subscriptions.push(
    vscode.commands.registerCommand("quickLink.openUrl", openUrl)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("quickLink.addUrl", async () => {
      await addUrl(config, treeData)
      config = vscode.workspace.getConfiguration("quickLink");
      treeData.root.children = [...config.siteList].map(
        ([name, url]) => new TreeItem(name, url)
      );
    
      treeData._onDidChangeTreeData.fire();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("quickLink.removeUrl", async ({ url }) => {
      await removeUrl(config, treeData, { url });
      config = vscode.workspace.getConfiguration("quickLink");
      treeData.root.children = [...config.siteList].map(
        ([name, url]) => new TreeItem(name, url)
      );
    
      treeData._onDidChangeTreeData.fire();
    })
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
