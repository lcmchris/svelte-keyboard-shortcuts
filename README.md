# Svelte Keyboard shortcuts

Keyboard shortcuts are a great way to make using your application much quicker. It especially enables your power users to be super quick on common actions.
Think of it as Vim for web applications.

This svelte library makes adding shortcuts easy and also consolidates the display of shortcuts available.

## Get started

To install this library:

`npm install -D svelte-keyboard-shortcuts`

layout.svelte

```svelte
<script lang="ts">
	import Shortcuts from 'svelte-keyboard-shortcuts';
</script>

<Shortcuts
	options={{
		// default options
		// generateKbd: true // Generate keyboard input element next to use: element.
		// timeout: 1000 // Timeout of keyboard inputs.
	}}
/>
```

page.svelte

```svelte
<script>
	import { shortcuts } from 'svelte-keyboard-shortcuts';
</script>

<button class="btn rounded-full border border-gray-400 p-2" use:shortcuts onclick={handleOnClick}
	>Press p to click button</button
>
<div use:shortcuts={{ keys: ['c'] }} tabindex="2">Press C to Focus on me!</div>

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
```

## Features

Types of action

- Run callback
- Set focus
- Click

Based upon:

- Single key press [x]
- Multi key press [x]
- Ordered key press [x]
- Customizable Key presses[]

Defaults behaviour by:

- HTML element tag name (<input>, <button>, <a>)
- HTML textValue or labels
