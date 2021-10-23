import { Editor, MarkdownView, Plugin } from 'obsidian';

export default class MoreEmacsPlugin extends Plugin {
	// Some notes for future me:
	//
	// If having trouble getting a hotkey to activate, try binding the
	// command to the desired key in Obsidian's settings; you can then
	// check .obsidian/hotkeys.json to see how to configure that key.
	//
	// Editor is an interface that spans CodeMirror versions, but doesn't
	// provide much. We jump through some hoops to get the active editor
	// in our callbacks below.
	//
	// CodeMirror commands: https://codemirror.net/doc/manual.html#commands

	async onload() {
		if (!window.CodeMirror || window.CodeMirror.version[0] > "5") {
			console.log("MoreEmacsPlugin not updated for new CodeMirror " + window.CodeMirror.version);
			return;
		}

		this.addCommand({
			id: 'emacs-scroll-up-command',
			name: 'scroll-up-command',
			hotkeys: [
				{ modifiers: ["Ctrl"], key: "V"},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.execCodeMirrorCommand("goPageDown");
			}
		});

		this.addCommand({
			id: 'emacs-scroll-down-command',
			name: 'scroll-down-command',
			hotkeys: [
				{ modifiers: ["Alt"], key: "V"},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.execCodeMirrorCommand("goPageUp");
			}
		});

		this.addCommand({
			id: 'emacs-kill-word',
			name: 'kill-word',
			hotkeys: [
				{ modifiers: ["Alt"], key: "D"},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.execCodeMirrorCommand("delWordAfter");
			}
		});

		this.addCommand({
			id: 'emacs-forward-word',
			name: 'forward-word',
			hotkeys: [
				{ modifiers: ["Alt"], key: "F"},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.execCodeMirrorCommand("goWordRight");
			}
		});

		this.addCommand({
			id: 'emacs-backward-word',
			name: 'backward-word',
			hotkeys: [
				{ modifiers: ["Alt"], key: "B"},
			],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.execCodeMirrorCommand("goWordLeft");
			}
		});
	}

	onunload() {
	}

	// execCodeMirrorCommand works around restrictions in the public API
	// for editors by finding CodeMirror editors directly. It works
	// similarly to Editor.exec() but without exec's restrictions on
	// command name.
	execCodeMirrorCommand(cmd: string) {
		this.app.workspace.iterateCodeMirrors(cm => {
			if (cm.hasFocus()) {
				cm.execCommand(cmd);
			}
		});
	}
}
