<script>
	let finds = [
		{
			name: 'GunDB',
			description: 'A decentralized, offline first, realtime database',
			link: 'https://github.com/amark/gun'
		},
		{
			name: 'Eruda',
			description: 'Console for mobile browsers',
			link: 'https://github.com/liriliri/eruda'
		}
	];
</script>

<svelte:head>
	<title>Finds</title>
	<meta name="description" content="Cool pieces of tech i found on the internet :D" />
</svelte:head>

<div class="mx-auto mb-12 w-full text-center">
	<h1 class="text-3xl font-medium">Finds</h1>
	<p class="mt-3 text-balance text-xl text-stone-600">
		Lesser known cool pieces of tech i found on the internet :D
	</p>
</div>

<div class="flex flex-col">
	{#each finds as item}
		<a target="_blank" href={item.link} class="mb-6 p-3">
			<div class="text-lg flex">
				<div>
					{item.name}
				</div>
			</div>
			<div class="text-sm text-stone-600/85">
				{item.description}
			</div>
		</a>
	{/each}
</div>
