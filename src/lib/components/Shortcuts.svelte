<script lang="ts">
	import { setAppOptions, keyPressesState, resetKeyPressesState } from '$lib/shortcuts.svelte.js';

	import type { AllKeys, AppOptions } from '$lib/shortcuts.svelte.js';
	let { options }: { options?: AppOptions } = $props();
	options = setAppOptions(options);

	let timer = 0;
</script>

<svelte:window
	onkeyup={(event) => {
		const exclude = ['input', 'textarea'];
		const eventTarget = event.target as HTMLElement;

		// Blur on escape
		if (event.key === 'Escape') {
			eventTarget.blur();
		}

		// Push on other keys
		if (exclude.indexOf(eventTarget.tagName.toLowerCase()) === -1) {
			keyPressesState.push(event.key as AllKeys);
			clearTimeout(timer);
			timer = setTimeout(() => {
				resetKeyPressesState();
			}, options.timeout);
		}
	}}
/>
