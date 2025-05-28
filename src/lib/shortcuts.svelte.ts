import type { Action } from 'svelte/action';

export type Options = {
	generateKbd?: boolean;
};

export type AppOptions = {
	timeout?: number;
} & Options;

let defaultOptions = {
	timeout: 1000,
	generateKbd: true
};

export function setAppOptions(options?: AppOptions) {
	defaultOptions = { ...defaultOptions, ...options };
	return defaultOptions;
}

type GeneralKeys =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z';
type ModifierKeys =
	| 'Alt'
	| 'AltGraph'
	| 'CapsLock'
	| 'Control'
	| 'Fn'
	| 'FnLock'
	| 'Hyper'
	| 'Meta'
	| 'NumLock'
	| 'ScrollLock'
	| 'Shift'
	| 'Super'
	| 'Symbol'
	| 'SymbolLock';
type WhitespaceKeys = 'Enter' | 'Tab' | ' ';
type NavigationKeys =
	| 'ArrowDown'
	| 'ArrowLeft'
	| 'ArrowRight'
	| 'ArrowUp'
	| 'End'
	| 'Home'
	| 'PageDown'
	| 'PageUp';
type FunctionKeys =
	| 'F1'
	| 'F2'
	| 'F3'
	| 'F4'
	| 'F5'
	| 'F6'
	| 'F7'
	| 'F8'
	| 'F9'
	| 'F10'
	| 'F11'
	| 'F12'
	| 'F13'
	| 'F14'
	| 'F15'
	| 'F16'
	| 'F17'
	| 'F18'
	| 'F19'
	| 'F20'
	| 'Soft1'
	| 'Soft2'
	| 'Soft3'
	| 'Soft4';
type NumericKeypadKeys =
	| 'Decimal'
	| 'Key11'
	| 'Key12'
	| 'Multiply'
	| 'Add'
	| 'Clear'
	| 'Divide'
	| 'Subtract'
	| 'Separator'
	| '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9';
type EditingKeys = "Backspace" | "Clear" | "Copy" | "CrSel" | "Cut" | "Delete" | "EraseEof" | "ExSel" | "Insert" | "Paste" | "Redo" | "Undo"

export type AllKeys =
	| GeneralKeys
	| ModifierKeys
	| WhitespaceKeys
	| NavigationKeys
	| FunctionKeys
	| NumericKeypadKeys
	| EditingKeys;

export let keyPressesState = $state<Array<AllKeys>>([]);
export const resetKeyPressesState = () => {
	keyPressesState.length = 0;
};
type params = {
	keys?: Array<AllKeys>;
	type?: 'auto' | 'callback' | 'click' | 'focus';
	fn?: () => void;
	options?: Options;
};

export const shortcuts: Action<HTMLElement, params | undefined> = (
	node: HTMLElement,
	{
		type = 'auto',
		keys = [],
		fn,
		options: { generateKbd = defaultOptions.generateKbd } = {}
	}: params | undefined = {}
) => {
	/* Attach a listener for keys when the node is attached.

	Types of action
	- Run callback if function [x]
	- Set focus if element [x]
	- Click if <a> or <button>
	
	Based upon:
	- Single key press [x]
	- Multi key press [x]
	- Ordered key press [x]
	- Customizable Key presses[]

	Visualise shortcuts on page []

	*/

	// Update type for auto
	if (type == 'auto') {
		const tagName = node.tagName;
		if (tagName == 'A' || tagName == 'BUTTON') {
			type = 'click';
		} else if (fn) {
			type = 'callback';
		} else {
			type = 'focus';
		}
	}

	// Update keys if empty
	if (!keys || keys?.length == 0) {
		const textValue = node.textContent;
		if (textValue && isAlphaNumeric(textValue[0])) {
			// use the first char as the shortcut.
			const firstCharVal = textValue[0];
			keys = [firstCharVal.toLowerCase() as AllKeys];
		} else if (node.tagName == 'INPUT') {
			const inputEle = node as HTMLInputElement;
			const firstLabel = inputEle.labels?.item(0).textContent;
			const firstCharVal = firstLabel?.[0] ?? '';
			keys = [firstCharVal.toLowerCase() as AllKeys];
		}
	}

	if (generateKbd) {
		createKbd(keys, node);
	}

	let handleKeyboardShortcut: (keyPresses: Array<AllKeys>) => void;
	if (type == 'callback' && fn) {
		handleKeyboardShortcut = () => {
			fn();
		};
	} else if (type == 'focus') {
		handleKeyboardShortcut = () => {
			node.focus();
		};
	} else if (type == 'click') {
		handleKeyboardShortcut = () => {
			node.click();
		};
	}

	console.log('Shortcuts attached.', node);
	$effect(() => {
		$effect(() => {
			if (keys && checkEquivSequence(keyPressesState, keys)) {
				handleKeyboardShortcut(keyPressesState);
				resetKeyPressesState();
			}
			return () => { };
		});

		return () => {
			// cleanup
		};
	});
};

function checkEquivSequence(keyPressesState: Array<AllKeys>, keys: Array<AllKeys>) {
	if (keys.length == 0) {
		return false;
	}

	const matchLength = keys.length;
	if (keyPressesState.length < matchLength) {
		return false;
	}

	const lastKeysState = keyPressesState.slice(keyPressesState.length - matchLength);

	for (const [idx, key] of keys.entries()) {
		if (key != lastKeysState[idx]) {
			return false;
		}
	}
	return true;
}

function isAlphaNumeric(str: string) {
	var code, i, len;

	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (
			!(code > 47 && code < 58) && // numeric (0-9)
			!(code > 64 && code < 91) && // upper alpha (A-Z)
			!(code > 96 && code < 123)
		) {
			// lower alpha (a-z)
			return false;
		}
	}
	return true;
}

function createKbd(keys: Array<AllKeys>, node: HTMLElement) {
	let lastKbd: HTMLElement;
	keys.forEach((key) => {
		const kbd = document.createElement('kbd');
		kbd.textContent = key;
		if (lastKbd) {
			lastKbd.after(kbd);
		} else if (node.tagName == 'INPUT') {
			const inputEle = node as HTMLInputElement;
			const firstLabel = inputEle.labels?.item(0);
			firstLabel?.prepend(kbd);
		} else {
			node.prepend(kbd);
		}
		lastKbd = kbd;
	});
}
