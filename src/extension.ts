import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    const commands = [
        {
            command: "codeWisdom",
            message: "the code not written with php"
        },
        {
            command: "nodeMemories",
            message: "Remembering the good days with Node.js"
        }
    ];

    commands.forEach(({ command, message }) => {
        const disposable = vscode.commands.registerCommand(command, () => {
            vscode.window.showInformationMessage(message);
        });
        context.subscriptions.push(disposable);
    });

    const editorListener = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;

        if (!editor || editor.document.languageId !== "php") {
            return;
        }

        const changes = event.contentChanges;
        if (changes.length === 0) {
            return;
        }

        const lastChange = changes[0];
        if (lastChange.text === "const") {
            editor.edit((editBuilder) => {
                const range = new vscode.Range(
                    editor.selection.start.line,
                    editor.selection.start.character - "const".length,
                    editor.selection.start.line,
                    editor.selection.start.character
                );
                editBuilder.replace(range, "$");
            });
        }
    });

    context.subscriptions.push(editorListener);
}

export function deactivate() {}
