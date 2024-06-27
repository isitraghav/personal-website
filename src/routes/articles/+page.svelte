<script>
	import axios from 'axios';
	import parseMD from 'parse-md';
	import { onMount } from 'svelte';

	let articles = [];

	let posts = ['hello-world.md'];

	onMount(() => {
		posts.forEach((p) => {
			axios.get(`${location.origin}/posts/${p}`).then((r) => {
				articles = [...articles, { ...parseMD(r.data).metadata, name: p }];
			});
		});
	});
</script>

<div class="mx-auto mb-12 w-full text-center">
	<h1 class="text-3xl font-medium">Articles</h1>
	<p class="mt-3 text-balance text-xl text-stone-600">A collection of the articles I've written.</p>
</div>

<div class="flex flex-col">
	{#each articles as article}
		<a href="/articles/{article.name.split('.')[0]}" class="mb-6 p-3">
			<div class="text-lg flex">
				<div>
					{article.title}
				</div>
				<div class="ml-auto text-sm text-stone-600">
					{new Date(article.published).toLocaleDateString()}
				</div>
			</div>
			<div class="text-sm text-stone-600/85">
				{article.description}
			</div>
		</a>
	{/each}
</div>
