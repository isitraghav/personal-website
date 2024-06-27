<script>
	import insane from 'insane';
	import { marked } from 'marked';

	export let data;
	let content = data.content;

	let sanitized = insane(marked(content));
</script>

{@html sanitized}