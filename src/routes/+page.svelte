<script lang="ts">
	import type { App } from '$lib/types';
	import AppCard from '$lib/components/AppCard.svelte';

	const featuredApps: App[] = [
		{
			id: '1',
			name: 'WhatsApp Business Pro',
			slug: 'whatsapp-business-pro',
			description: 'Aplikasi chat bisnis profesional dengan fitur lengkap untuk mengelola pelanggan.',
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
			description: 'Sistem kasir online lengkap untuk toko retail dan restoran.',
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
			description: 'Buat invoice profesional dalam hitungan detik.',
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
			description: 'Kelola stok barang dengan mudah dan efisien.',
			short_description: 'Manajemen stok barang',
			type: 'apk',
			price: 75000,
			icon_url: 'https://placehold.co/128x128/7C3AED/white?text=INV',
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
			description: 'Jadwalkan posting ke semua sosial media dari satu dashboard.',
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
			description: 'Platform pembelajaran online dengan video, kuis, dan sertifikat.',
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
		}
	];

	const categories = [
		{ name: 'Bisnis', icon: '💼', count: 24 },
		{ name: 'Produktivitas', icon: '⚡', count: 18 },
		{ name: 'Marketing', icon: '📢', count: 12 },
		{ name: 'Edukasi', icon: '📚', count: 15 },
		{ name: 'Keuangan', icon: '💰', count: 9 },
		{ name: 'Utilitas', icon: '🔧', count: 21 }
	];
</script>

<svelte:head>
	<title>TokoApps - Marketplace Aplikasi APK & Web Apps</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-16 lg:py-24">
	<div class="hero-content text-center">
		<div class="max-w-2xl">
			<h1 class="text-4xl lg:text-5xl font-bold">Temukan Aplikasi Terbaik untuk Bisnis Anda</h1>
			<p class="py-6 text-lg text-base-content/70">
				Marketplace terpercaya untuk aplikasi APK dan Web Apps berkualitas. 
				Dari sistem kasir hingga tools marketing, semua ada di sini.
			</p>
			<div class="flex flex-wrap gap-3 justify-center">
				<a href="/apps?type=apk" class="btn btn-primary">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
					</svg>
					Jelajahi APK
				</a>
				<a href="/apps?type=webapp" class="btn btn-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
					</svg>
					Jelajahi Web Apps
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Stats -->
<section class="bg-base-200 py-8">
	<div class="container mx-auto px-4">
		<div class="stats stats-vertical lg:stats-horizontal shadow w-full">
			<div class="stat">
				<div class="stat-figure text-primary">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
				</div>
				<div class="stat-title">Total Download</div>
				<div class="stat-value text-primary">67.2K</div>
			</div>
			<div class="stat">
				<div class="stat-figure text-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<div class="stat-title">Aplikasi Tersedia</div>
				<div class="stat-value text-secondary">120+</div>
			</div>
			<div class="stat">
				<div class="stat-figure text-accent">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</div>
				<div class="stat-title">Pengguna Aktif</div>
				<div class="stat-value">8.4K</div>
			</div>
			<div class="stat">
				<div class="stat-figure text-warning">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
					</svg>
				</div>
				<div class="stat-title">Rating Rata-rata</div>
				<div class="stat-value text-warning">4.7</div>
			</div>
		</div>
	</div>
</section>

<!-- Categories -->
<section class="py-12 container mx-auto px-4">
	<div class="flex justify-between items-center mb-8">
		<h2 class="text-2xl font-bold">Kategori Populer</h2>
		<a href="/categories" class="btn btn-ghost btn-sm">Lihat Semua →</a>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
		{#each categories as category}
			<a href="/apps?category={category.name}" class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200">
				<div class="card-body items-center text-center p-4">
					<span class="text-3xl">{category.icon}</span>
					<h3 class="font-semibold text-sm">{category.name}</h3>
					<p class="text-xs text-base-content/60">{category.count} apps</p>
				</div>
			</a>
		{/each}
	</div>
</section>

<!-- Featured Apps -->
<section class="py-12 bg-base-200">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center mb-8">
			<h2 class="text-2xl font-bold">Aplikasi Unggulan</h2>
			<a href="/apps" class="btn btn-ghost btn-sm">Lihat Semua →</a>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each featuredApps as app}
				<AppCard {app} />
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-16 container mx-auto px-4">
	<div class="card bg-primary text-primary-content">
		<div class="card-body text-center py-12">
			<h2 class="text-3xl font-bold">Punya Aplikasi untuk Dijual?</h2>
			<p class="text-primary-content/80 max-w-md mx-auto">
				Daftarkan aplikasi Anda di TokoApps dan jangkau ribuan pengguna yang mencari solusi digital.
			</p>
			<div class="card-actions justify-center mt-4">
				<a href="/register" class="btn btn-secondary">Mulai Jual Sekarang</a>
			</div>
		</div>
	</div>
</section>
