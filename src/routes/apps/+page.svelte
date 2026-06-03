<script lang="ts">
	import type { App } from '$lib/types';
	import AppCard from '$lib/components/AppCard.svelte';
	import { page } from '$app/state';

	let { data } = $props();

	let selectedType = $state(page.url.searchParams.get('type') || 'all');
	let selectedCategory = $state(page.url.searchParams.get('category') || 'all');
	let sortBy = $state('popular');

	const allApps: App[] = data.allApps;

	let filteredApps = $derived.by(() => {
		let apps = [...allApps];
		if (selectedType !== 'all') {
			apps = apps.filter(a => a.type === selectedType);
		}
		if (selectedCategory !== 'all') {
			apps = apps.filter(a => a.category === selectedCategory);
		}
		switch (sortBy) {
			case 'popular':
				apps.sort((a, b) => b.total_downloads - a.total_downloads);
				break;
			case 'rating':
				apps.sort((a, b) => b.rating - a.rating);
				break;
			case 'newest':
				apps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
				break;
			case 'price-low':
				apps.sort((a, b) => a.price - b.price);
				break;
			case 'price-high':
				apps.sort((a, b) => b.price - a.price);
				break;
		}
		return apps;
	});

	const categories = ['all', ...data.categories.map((c: { name: string }) => c.name)];
</script>

<svelte:head>
	<title>Semua Aplikasi - TokoApps</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-2">Semua Aplikasi</h1>
	<p class="text-base-content/60 mb-8">Temukan aplikasi yang sesuai dengan kebutuhan Anda</p>

	<!-- Filters -->
	<div class="flex flex-wrap gap-4 mb-8 p-4 bg-base-200 rounded-xl">
		<div class="form-control">
			<label class="label" for="type-filter">
				<span class="label-text font-medium">Tipe</span>
			</label>
			<select id="type-filter" class="select select-bordered select-sm" bind:value={selectedType}>
				<option value="all">Semua Tipe</option>
				<option value="apk">APK</option>
				<option value="webapp">Web App</option>
			</select>
		</div>
		<div class="form-control">
			<label class="label" for="category-filter">
				<span class="label-text font-medium">Kategori</span>
			</label>
			<select id="category-filter" class="select select-bordered select-sm" bind:value={selectedCategory}>
				{#each categories as cat}
					<option value={cat}>{cat === 'all' ? 'Semua Kategori' : cat}</option>
				{/each}
			</select>
		</div>
		<div class="form-control">
			<label class="label" for="sort-filter">
				<span class="label-text font-medium">Urutkan</span>
			</label>
			<select id="sort-filter" class="select select-bordered select-sm" bind:value={sortBy}>
				<option value="popular">Terpopuler</option>
				<option value="rating">Rating Tertinggi</option>
				<option value="newest">Terbaru</option>
				<option value="price-low">Harga Terendah</option>
				<option value="price-high">Harga Tertinggi</option>
			</select>
		</div>
	</div>

	<!-- Results -->
	<p class="text-sm text-base-content/60 mb-4">{filteredApps.length} aplikasi ditemukan</p>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredApps as app (app.id)}
			<AppCard {app} />
		{/each}
	</div>

	{#if filteredApps.length === 0}
		<div class="text-center py-16">
			<p class="text-xl font-medium text-base-content/50">Tidak ada aplikasi yang ditemukan</p>
			<p class="text-base-content/40 mt-2">Coba ubah filter pencarian Anda</p>
		</div>
	{/if}
</div>
