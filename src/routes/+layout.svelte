<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import Shortcuts from '$lib/components/Shortcuts.svelte';
</script>

{@render children()}

<!-- Add this to your root layout.svelte -->
<Shortcuts
	options={{
		// default options
		// generateKbd: true
		// timeout: 1000
	}}
/>
