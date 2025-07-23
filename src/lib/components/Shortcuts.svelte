<script lang="ts">
	import {
		setAppOptions,
		keyPressesState,
		modifiersState,
		modifiersMapping,
		type PressModifiers,
		resetKeyPressesState
	} from '$lib/shortcuts.svelte.js';

	import type { AllKeys, AppOptions } from '$lib/shortcuts.svelte.js';
	let { options }: { options?: AppOptions } = $props();
	options = setAppOptions(options);

	let timer = 0;

	const lettersPattern = /^Key[A-Z]$/;
	const digitsPattern = /^Digit[0-9]$/;
	const modifiersPattern = /^(Alt|Control|Shift|Meta)(Right|Left)$/;
	const symbolsMap: Record<string, AllKeys> = {
		BracketLeft: '[',
		BracketRight: ']',
		Semicolon: ';',
		Quote: "'",
		Backslash: '\\',
		Minus: '-',
		Equal: '=',
		Comma: ',',
		Period: '.',
		Slash: '/',
		Backquote: '`'
	};
</script>

<svelte:window
	onkeyup={(event) => {
		const exclude = ['input', 'textarea'];
		const eventTarget = event.target as HTMLElement;

		// Blur on escape
		if (event.key === 'Escape') {
			eventTarget.blur();
		}
		for (const [modifier, key] of Object.entries(modifiersMapping)) {
			modifiersState[modifier as PressModifiers] = event[key];
		}

		// Push on other keys
		if (exclude.indexOf(eventTarget.tagName.toLowerCase()) === -1) {
			// Fallback for mobile devices
			if (!event.code) {
				keyPressesState.push(event.key as AllKeys);
			} else {
				if (lettersPattern.test(event.code)) {
					// Store any letter keypresses as lowercase letters
					keyPressesState.push(event.code.slice(3).toLowerCase() as AllKeys);
				} else if (digitsPattern.test(event.code)) {
					// Shorten DigitN patterns
					keyPressesState.push(event.code.slice(5) as AllKeys);
				} else if (modifiersPattern.test(event.code)) {
					// Strip position from modifier keys bc everyone will forget the existence or right-hand keys anyways
					keyPressesState.push(modifiersPattern.exec(event.code)![1] as AllKeys);
				} else if (event.code in symbolsMap) {
					// Shorten other main keys
					keyPressesState.push(symbolsMap[event.code as keyof typeof symbolsMap]);
				} else if (event.code === 'Help') {
					// "Help" and "Insert" both behave differently in Firefox and Chrome, treat both as "Insert"
					keyPressesState.push('Insert');
				} else {
					keyPressesState.push(event.code as AllKeys);
				}
			}
			clearTimeout(timer);
			timer = setTimeout(() => {
				resetKeyPressesState();
			}, options.timeout);
		}
	}}
/>
