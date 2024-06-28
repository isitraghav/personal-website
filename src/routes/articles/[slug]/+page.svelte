<script>
	import insane from 'insane';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import parseMD from 'parse-md';

	let sanitized = '';
	let title = '';
	let description = '';
	onMount(() => {
		axios.get(`${location.href.replace('articles', 'posts')}.md`).then((r) => {
			title = parseMD(r.data).metadata['title'];
			description = parseMD(r.data).metadata['description'];

			sanitized = insane(marked(parseMD(r.data).content));
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
{@html sanitized}
