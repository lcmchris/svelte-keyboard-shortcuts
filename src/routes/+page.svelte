<script lang="ts">
	import { keyPressesState, shortcuts } from '$lib/shortcuts.svelte.js';

	function handleOnClick() {
		window.alert('Button is clicked!');
	}
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex w-fit flex-col items-start gap-4 rounded-md bg-slate-100 p-16">
		<button
			class="btn rounded-full border border-gray-400 p-2"
			use:shortcuts
			onclick={handleOnClick}>Press p to click button</button
		>
		<div use:shortcuts={{ keys: ['c'] }} tabindex="2">Press C to Focus on me!</div>
		<div use:shortcuts={{ keys: ['Delete'] }} tabindex="2">Press Delete to Focus on me!</div>

		<label>
			F to focus on me
			<input use:shortcuts placeholder="Esc to blur." />
		</label>

		<a use:shortcuts={{ keys: ['a', 's', 'd'] }} href="/about">Ordered keys + links</a>

		<div class="flex flex-row">
			<span>Keys pressed:</span>
			{#each keyPressesState as keyPress}
				<kbd>{keyPress}</kbd>
			{/each}
		</div>
	</div>
</div>
