<script lang="ts">
	import type { App } from '$lib/types';
	import { page } from '$app/state';

	function formatPrice(price: number): string {
		if (price === 0) return 'Gratis';
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
	}

	// In production, this would come from Supabase based on the slug
	const app: App = {
		id: '1',
		name: 'WhatsApp Business Pro',
		slug: 'whatsapp-business-pro',
		description: `WhatsApp Business Pro adalah solusi komunikasi bisnis yang dirancang khusus untuk pemilik usaha kecil dan menengah. Aplikasi ini menawarkan fitur-fitur canggih yang tidak tersedia di versi reguler.

Fitur Utama:
• Auto-reply pesan pelanggan
• Katalog produk terintegrasi
• Analitik pesan dan respons
• Label untuk organisasi chat
• Quick replies untuk FAQ
• Broadcast message ke banyak kontak
• Integrasi dengan CRM populer

Cocok untuk:
- Toko online
- Jasa layanan profesional
- Restoran dan kafe
- Freelancer`,
		short_description: 'Chat bisnis profesional dengan fitur lengkap',
		type: 'apk',
		price: 49000,
		icon_url: 'https://placehold.co/128x128/4F46E5/white?text=WA',
		screenshots: [
			'https://placehold.co/400x700/E5E7EB/374151?text=Screenshot+1',
			'https://placehold.co/400x700/E5E7EB/374151?text=Screenshot+2',
			'https://placehold.co/400x700/E5E7EB/374151?text=Screenshot+3',
			'https://placehold.co/400x700/E5E7EB/374151?text=Screenshot+4'
		],
		category: 'Bisnis',
		developer: 'TokoApps Dev',
		version: '2.1.0',
		download_url: '#',
		rating: 4.8,
		total_downloads: 15230,
		created_at: '2024-01-01',
		updated_at: '2024-01-15'
	};
</script>

<svelte:head>
	<title>{app.name} - TokoApps</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<div class="breadcrumbs text-sm mb-6">
		<ul>
			<li><a href="/">Beranda</a></li>
			<li><a href="/apps">Aplikasi</a></li>
			<li>{app.name}</li>
		</ul>
	</div>

	<!-- App Header -->
	<div class="flex flex-col lg:flex-row gap-8">
		<div class="flex-1">
			<div class="flex items-start gap-5 mb-6">
				<img src={app.icon_url} alt={app.name} class="w-24 h-24 rounded-2xl shadow-md" />
				<div>
					<h1 class="text-3xl font-bold">{app.name}</h1>
					<p class="text-base-content/60 mt-1">{app.developer}</p>
					<div class="flex items-center gap-3 mt-3">
						<span class="badge badge-lg" class:badge-primary={app.type === 'apk'} class:badge-secondary={app.type === 'webapp'}>
							{app.type === 'apk' ? 'APK' : 'Web App'}
						</span>
						<span class="badge badge-lg badge-ghost">{app.category}</span>
						<span class="badge badge-lg badge-outline">v{app.version}</span>
					</div>
				</div>
			</div>

			<!-- Stats Row -->
			<div class="flex flex-wrap gap-6 mb-8 p-4 bg-base-200 rounded-xl">
				<div class="text-center">
					<div class="flex items-center gap-1 text-warning">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 24 24">
							<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
						</svg>
						<span class="font-bold text-lg">{app.rating}</span>
					</div>
					<p class="text-xs text-base-content/50">Rating</p>
				</div>
				<div class="text-center">
					<p class="font-bold text-lg">{(app.total_downloads / 1000).toFixed(1)}K</p>
					<p class="text-xs text-base-content/50">Downloads</p>
				</div>
				<div class="text-center">
					<p class="font-bold text-lg">{app.type === 'apk' ? 'Android' : 'Browser'}</p>
					<p class="text-xs text-base-content/50">Platform</p>
				</div>
			</div>

			<!-- Screenshots -->
			<div class="mb-8">
				<h2 class="text-xl font-bold mb-4">Screenshots</h2>
				<div class="flex gap-4 overflow-x-auto pb-4">
					{#each app.screenshots as screenshot, i}
						<img src={screenshot} alt="Screenshot {i + 1}" class="rounded-xl h-64 object-cover shadow-sm" />
					{/each}
				</div>
			</div>

			<!-- Description -->
			<div class="mb-8">
				<h2 class="text-xl font-bold mb-4">Deskripsi</h2>
				<div class="prose max-w-none">
					<p class="whitespace-pre-line text-base-content/80">{app.description}</p>
				</div>
			</div>
		</div>

		<!-- Sidebar - Purchase -->
		<div class="lg:w-80">
			<div class="card bg-base-100 shadow-md border border-base-200 sticky top-4">
				<div class="card-body">
					<div class="text-center mb-4">
						<p class="text-3xl font-bold text-primary">{formatPrice(app.price)}</p>
						{#if app.price === 0}
							<p class="text-sm text-success mt-1">Gratis selamanya</p>
						{:else}
							<p class="text-sm text-base-content/50 mt-1">Sekali bayar, akses selamanya</p>
						{/if}
					</div>
					
					<button class="btn btn-primary btn-block">
						{#if app.price === 0}
							Download Gratis
						{:else}
							Beli Sekarang
						{/if}
					</button>
					
					{#if app.demo_url}
						<a href={app.demo_url} class="btn btn-outline btn-block">
							Coba Demo
						</a>
					{/if}

					<div class="divider"></div>

					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
							<span class="text-base-content/60">Versi</span>
							<span class="font-medium">{app.version}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-base-content/60">Tipe</span>
							<span class="font-medium">{app.type === 'apk' ? 'Android APK' : 'Web Application'}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-base-content/60">Kategori</span>
							<span class="font-medium">{app.category}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-base-content/60">Update terakhir</span>
							<span class="font-medium">{new Date(app.updated_at).toLocaleDateString('id-ID')}</span>
						</div>
					</div>

					<div class="divider"></div>

					<div class="bg-base-200 rounded-lg p-3">
						<p class="text-xs text-base-content/60 text-center">
							🔒 Transaksi aman & terenkripsi. Garansi 7 hari uang kembali.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
