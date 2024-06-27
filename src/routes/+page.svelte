<script>
	let repos = ['youtube-summarise-ai', 'youtube-dl', 'throw-me', 'live-loc', 'artifact'];
</script>

<main class="py-6 md:py-10">
	<section
		class="prose prose-stone mt-4 md:prose-lg prose-a:underline prose-a:decoration-stone-400 prose-a:underline-offset-4 prose-li:marker:text-stone-400"
	>
		<h1 class="not-prose text-2xl font-medium text-stone-950" data-svelte-h="svelte-zb4uuv">
			Hi, I'm Raghav
		</h1>
		<p>I've been working professionally in tech while nurturing a deep passion for it.</p>
		<p>
			I really enjoy building and maintaining open source projects and learning new things, and I'm
			always looking for new opportunities.
		</p>
		<p>Some of the more notable projects I've built or helped build and maintain are:</p>
		<ul>
			{#each repos as repo}
				<li><a href={`https://github.com/isitraghav/${repo}`} target="_blank">{repo}</a></li>
			{/each}
		</ul>
		<p>
			I find fulfillment in sharing what I learn with others, mostly through written content, which
			you can find at <a href="/articles">this link</a>.
		</p>
	</section>
</main>

<style lang="postcss">
	p {
		@apply mb-4 text-stone-600 leading-loose font-normal;
		margin-top: 1.3333333em;
		margin-bottom: 1.3333333em;
	}

	ul {
		@apply list-inside list-disc mb-4;
	}

	ul > li > a {
		@apply underline decoration-stone-400 underline-offset-4 text-lg;
	}

	ul > li {
		@apply py-2 capitalize;
	}

	main {
		@apply py-10;
	}
</style>
