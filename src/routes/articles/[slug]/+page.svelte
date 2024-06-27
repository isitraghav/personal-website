<script>
	import insane from 'insane';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import parseMD from 'parse-md';

	let sanitized = '';
	onMount(() => {
		axios.get(`${location.href.replace('articles', 'posts')}.md`).then((r) => {
			sanitized = insane(marked(parseMD(r.data).content));
		});
	});
</script>

{@html sanitized}
