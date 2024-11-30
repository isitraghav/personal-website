<script>
	import insane from 'insane';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import parseMD from 'parse-md';

	import { page } from '$app/stores';

	let sanitized = '';
	let title = '';
	let description = '';
	onMount(() => {
		axios.get(`https://dev.to/api/articles/isitraghav/${$page.params.slug}`).then((res) => {
			const article = res.data;
			title = article.title;
			description = article.description;
			sanitized = article.body_html;
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
<div>
	<h1 class="text-3xl">{title}</h1>
</div>
{@html sanitized}
