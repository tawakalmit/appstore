<script lang="ts">
	import type { App } from '$lib/types';
	import AppCard from '$lib/components/AppCard.svelte';
	import { page } from '$app/state';

	let selectedType = $state(page.url.searchParams.get('type') || 'all');
	let selectedCategory = $state(page.url.searchParams.get('category') || 'all');
	let sortBy = $state('popular');

	const allApps: App[] = [
		{
			id: '1',
			name: 'WhatsApp Business Pro',
			slug: 'whatsapp-business-pro',
			description: 'Aplikasi chat bisnis profesional.',
			short_description: 'Chat bisnis profesional',
			type: 'apk',
			price: 49000,
			icon_url: 'https://placehold.co/128x128/4F46E5/white?text=WA',
			screenshots: [],
			category: 'Bisnis',
			developer: 'TokoApps Dev',
			version: '2.1.0',
			download_url: '#',
			rating: 4.8,
			total_downloads: 15230,
			created_at: '2024-01-01',
			updated_at: '2024-01-15'
		},
		{
			id: '2',
			name: 'POS Kasir Online',
			slug: 'pos-kasir-online',
			description: 'Sistem kasir online lengkap.',
			short_description: 'Sistem kasir online lengkap',
			type: 'webapp',
			price: 99000,
			icon_url: 'https://placehold.co/128x128/059669/white?text=POS',
			screenshots: [],
			category: 'Bisnis',
			developer: 'TokoApps Dev',
			version: '3.0.1',
			download_url: '#',
			demo_url: '#',
			rating: 4.6,
			total_downloads: 8750,
			created_at: '2024-02-01',
			updated_at: '2024-03-10'
		},
		{
			id: '3',
			name: 'Invoice Generator',
			slug: 'invoice-generator',
			description: 'Buat invoice profesional.',
			short_description: 'Buat invoice profesional',
			type: 'webapp',
			price: 0,
			icon_url: 'https://placehold.co/128x128/D97706/white?text=INV',
			screenshots: [],
			category: 'Produktivitas',
			developer: 'TokoApps Dev',
			version: '1.5.0',
			download_url: '#',
			demo_url: '#',
			rating: 4.3,
			total_downloads: 22100,
			created_at: '2024-01-20',
			updated_at: '2024-02-28'
		},
		{
			id: '4',
			name: 'Inventory Manager',
			slug: 'inventory-manager',
			description: 'Kelola stok barang dengan mudah.',
			short_description: 'Manajemen stok barang',
			type: 'apk',
			price: 75000,
			icon_url: 'https://placehold.co/128x128/7C3AED/white?text=STK',
			screenshots: [],
			category: 'Bisnis',
			developer: 'TokoApps Dev',
			version: '2.3.0',
			download_url: '#',
			rating: 4.5,
			total_downloads: 5600,
			created_at: '2024-03-01',
			updated_at: '2024-03-15'
		},
		{
			id: '5',
			name: 'Social Media Scheduler',
			slug: 'social-media-scheduler',
			description: 'Jadwalkan posting sosmed.',
			short_description: 'Jadwalkan posting sosmed',
			type: 'webapp',
			price: 149000,
			icon_url: 'https://placehold.co/128x128/DC2626/white?text=SMS',
			screenshots: [],
			category: 'Marketing',
			developer: 'TokoApps Dev',
			version: '1.0.0',
			download_url: '#',
			demo_url: '#',
			rating: 4.7,
			total_downloads: 3200,
			created_at: '2024-03-10',
			updated_at: '2024-03-20'
		},
		{
			id: '6',
			name: 'E-Learning Platform',
			slug: 'e-learning-platform',
			description: 'Platform pembelajaran online.',
			short_description: 'Platform pembelajaran online',
			type: 'webapp',
			price: 199000,
			icon_url: 'https://placehold.co/128x128/0891B2/white?text=EDU',
			screenshots: [],
			category: 'Edukasi',
			developer: 'TokoApps Dev',
			version: '2.0.0',
			download_url: '#',
			demo_url: '#',
			rating: 4.9,
			total_downloads: 12400,
			created_at: '2024-02-15',
			updated_at: '2024-03-25'
		},
		{
			id: '7',
			name: 'Expense Tracker',
			slug: 'expense-tracker',
			description: 'Lacak pengeluaran harian.',
			short_description: 'Lacak pengeluaran harian Anda',
			type: 'apk',
			price: 29000,
			icon_url: 'https://placehold.co/128x128/16A34A/white?text=EXP',
			screenshots: [],
			category: 'Keuangan',
			developer: 'TokoApps Dev',
			version: '1.2.0',
			download_url: '#',
			rating: 4.4,
			total_downloads: 9800,
			created_at: '2024-01-10',
			updated_at: '2024-02-20'
		},
		{
			id: '8',
			name: 'QR Code Scanner Pro',
			slug: 'qr-code-scanner-pro',
			description: 'Scanner QR code cepat dan akurat.',
			short_description: 'Scanner QR code cepat',
			type: 'apk',
			price: 0,
			icon_url: 'https://placehold.co/128x128/1D4ED8/white?text=QR',
			screenshots: [],
			category: 'Utilitas',
			developer: 'TokoApps Dev',
			version: '4.0.0',
			download_url: '#',
			rating: 4.2,
			total_downloads: 31000,
			created_at: '2024-01-05',
			updated_at: '2024-03-01'
		}
	];

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

	const categories = ['all', 'Bisnis', 'Produktivitas', 'Marketing', 'Edukasi', 'Keuangan', 'Utilitas'];
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
