// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testui" is now active!');

	// 注册指令
	let disposable = vscode.commands.registerCommand('testui.helloWorld', () => {
		// 执行 vscode 指令，可以传参，可以有返回值
		vscode.commands.executeCommand("editor.action.addCommentLine");

	});
	context.subscriptions.push(disposable);
	
	// 在指定文件格式下，显示悬停弹窗
	disposable = vscode.languages.registerHoverProvider(
		'cpp',
		new class implements vscode.HoverProvider {
			provideHover(
				_document: vscode.TextDocument,
				_position: vscode.Position,
				_token: vscode.CancellationToken
			): vscode.ProviderResult<vscode.Hover> {
				// 将指令字符串生成 uri 指令
				// 指令字符串格式：command: 指令 ID
				const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
				// 生成 markdown 文本用于悬浮显示
				const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);

				// command URIs如果想在Markdown 内容中生效, 你必须设置`isTrusted`。
				// 当创建可信的Markdown 字符, 请合理地清理所有的输入内容
				// 以便你期望的命令command URIs生效
				contents.isTrusted = true;

				return new vscode.Hover(contents);
			}
		}()
	);
	// 取消注册
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
