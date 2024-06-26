<script>
	import './app.css';

	let links = [
		{ name: 'Articles', href: '/articles' },
		{ name: 'Finds', href: '/finds' },
		{ name: 'Notes', href: '/notes' },
		{ name: 'Contact', href: '/contact' }
	];
</script>

<div class="py-6">
	<nav class="flex flex-col justify-center items-center md:flex-row gap-2">
		<div class="text-lg font-bold md:text-xl">
			<a href="/">RY</a>
		</div>
		<div class="ml-auto gap-3 flex mr-auto md:mr-0">
			{#each links as link}
				<a
					href={link.href}
					class="text-sm uppercase font-semibold text-stone-600/85 hover:text-stone-700"
					>{link.name}</a
				>
			{/each}
		</div>
	</nav>
</div>

<slot />

<!-- footer -->
<footer class="mx-auto mt-auto flex w-full items-center justify-between py-4">
	<div class="flex items-center text-xs tracking-tighter" data-svelte-h="svelte-iqzocg">
		<a href="https://www.gnu.org/licenses/gpl-3.0.en.html#license-text" class="font-medium"
			>GNU GPL v3</a
		> <span>&nbsp;© 2024 Raghav Yadav</span>
	</div>
	<div class="flex items-center gap-1">
		<a
			href="https://github.com/isitraghav"
			target="_blank"
			class="inline-flex size-8 items-center justify-center text-stone-500 hover:text-stone-700"
		>
			<box-icon class="opacity-60" type="logo" name="github"></box-icon>
			<span class="sr-only">GitHub</span>
		</a>
		<a
			href="https://x.com/isitraghav"
			target="_blank"
			class="inline-flex size-8 items-center justify-center text-stone-500 hover:text-stone-700"
		>
			<box-icon type="logo" class="opacity-60" name="instagram-alt"></box-icon>
			<span class="sr-only">Instagram</span>
		</a>
	</div>
</footer>
<!-- footer -->
