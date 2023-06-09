// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "testui" is now active!');

	// 自定义指令
	let disposable = vscode.commands.registerCommand('testui.custom',(msg:string)=>{
		vscode.window.showInformationMessage(msg);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('testui.helloWorld', () => {
		// 执行 vscode 指令，可以传参，可以有返回值
		vscode.commands.executeCommand("editor.action.addCommentLine");

		// 传参执行
		vscode.commands.executeCommand("testui.custom","fuck you");
	});
	context.subscriptions.push(disposable);
	
	disposable = vscode.commands.registerCommand('testui.inputbox',()=>{
		// 输入框
		vscode.window.showInputBox().then((value)=>{
			if (value != undefined){
				vscode.window.showInformationMessage(value);
			}
		});
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('testui.quickpick',()=>{
		// 选择输入框
		const strItems = ["fuck1","fuck2","fuck3"];
		vscode.window.showQuickPick(strItems).then((value)=>{
			if (value != undefined){
				vscode.window.showInformationMessage(value);
			}
		});

	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('testui.customquickpick',()=>{
		// 选项
		const options : { [key:string] : string} = {
			"option1":"fuck1",
			"option2":"fuck2",
			"option3":"fuck3",
		};

		// 自定义 quickpick
		const quickpick = vscode.window.createQuickPick();

		// 界面选项
		quickpick.items = Object.keys(options).map( value => {
			return  {label: value};
		});

		// 注册事件，有多选，因此是数组
		quickpick.onDidChangeSelection((values)=>{
			vscode.window.showInformationMessage(options[values[0].label]);
			
			// 隐藏
			quickpick.hide();
		});

		// 丢弃ui
		quickpick.onDidHide(() => quickpick.dispose());

		quickpick.show();

	});
	context.subscriptions.push(disposable);
	
	disposable = vscode.commands.registerCommand('testui.document',()=>{

		// 当前激活的文本框
		const editor = vscode.window.activeTextEditor;

		// 鼠标位置
		console.log(editor?.selection.active);	
		
		// 当前编辑框所能看见的文本范围
		console.log(editor?.visibleRanges);	
		
		// 文本编辑
		editor?.edit((editBuilder)=>{
			editBuilder.insert(new vscode.Position(10,1),"fuck you");	
		});
	});
	context.subscriptions.push(disposable);
	
	/* =====================LSP=========================== */
	/* 
		LSP (language server protocol)：代码的静态分析逻辑都放到了一个 language server 上，
		server 的实现只要遵守 LSP 协议，vscode 执行时，就能从 server 上获取代码分析结果，实
		现代码检查、自动补全、提示等功能。这么做的好处就是每个 editor 就是一个客户端，所有的
		editor 分析代码都是从一个 language server 上获取结果。并且服务进行复杂运算，不会造成
		vscode 卡死。 
		LSP 有两种实现：LSP 的底层思想是 RPC (远程调用)
		1. 直接调用 vscode api 来注册服务接口 vscode.languages.registerxxx()
		2. 创建服务连接 const connection = createConnection(ProposedFeatures.all); ，然后
		自定义服务连接
	*/

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
				// 指令字符串格式：command: 指令ID
				const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);

				// 传参
				// command:指令ID ? 
				const msgCommandUri = vscode.Uri.parse(`command:testui.custom?${encodeURIComponent(JSON.stringify("uri fuck"))}`);

				// 生成 markdown 文本用于悬浮显示
				const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})  [Show msg](${msgCommandUri})`);

				// command URIs如果想在Markdown 内容中生效, 你必须设置`isTrusted`。
				// 当创建可信的Markdown 字符, 请合理地清理所有的输入内容
				// 以便你期望的命令command URIs生效
				contents.isTrusted = true;

				return new vscode.Hover(contents);
			}
		}()
	);
	context.subscriptions.push(disposable);
	
	// 代码补全
	const provider = vscode.languages.registerCompletionItemProvider( 
		'cpp',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext)
			{
				console.log(document);
				const commpleton1 = new vscode.CompletionItem("test()");
				commpleton1.insertText = "fuck fuck you"

				return [
					commpleton1
				];
			}
		}
	 );
	
	// 添加
	context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
