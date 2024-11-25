<script lang="ts">
	import { shortcuts } from '$lib/shortcuts.svelte.js';
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<p>Created by Chris.</p>
	<a href="/" use:shortcuts={{ keys: ['ArrowLeft'] }}>⬅️ back</a>
</div>
