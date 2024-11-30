<script>
	import insane from 'insane';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import axios from 'axios';

	import { page } from '$app/stores';

	let sanitized = '';
	let title = '';
	let description = '';
	let data_published;
	onMount(() => {
		axios.get(`https://dev.to/api/articles/isitraghav/${$page.params.slug}`).then((res) => {
			const article = res.data;
			title = article.title;
			description = article.description;
			sanitized = article.body_html;
			data_published = article.published_at;
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
<div>
	<h1 class="text-3xl">{title}</h1>
	<h5 class="text-stone-600">
		Published {new Date(data_published).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})}
	</h5>
</div>
{@html insane(marked(sanitized))}
