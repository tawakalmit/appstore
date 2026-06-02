<script lang="ts">
	const categories = [
		{ name: 'Bisnis', icon: '💼', count: 24, description: 'Aplikasi untuk mengelola dan mengembangkan bisnis Anda' },
		{ name: 'Produktivitas', icon: '⚡', count: 18, description: 'Tools untuk meningkatkan efisiensi kerja sehari-hari' },
		{ name: 'Marketing', icon: '📢', count: 12, description: 'Solusi pemasaran digital dan manajemen sosial media' },
		{ name: 'Edukasi', icon: '📚', count: 15, description: 'Platform belajar dan manajemen pembelajaran' },
		{ name: 'Keuangan', icon: '💰', count: 9, description: 'Aplikasi akuntansi, invoice, dan manajemen keuangan' },
		{ name: 'Utilitas', icon: '🔧', count: 21, description: 'Tools pendukung dan utilitas untuk berbagai kebutuhan' },
		{ name: 'Desain', icon: '🎨', count: 7, description: 'Tools desain grafis dan editing multimedia' },
		{ name: 'Komunikasi', icon: '💬', count: 11, description: 'Aplikasi chat, video call, dan kolaborasi tim' },
		{ name: 'E-Commerce', icon: '🛒', count: 14, description: 'Platform toko online dan manajemen marketplace' },
		{ name: 'Kesehatan', icon: '🏥', count: 5, description: 'Aplikasi kesehatan, fitness, dan wellbeing' },
		{ name: 'Hiburan', icon: '🎮', count: 8, description: 'Aplikasi hiburan, game, dan streaming' },
		{ name: 'Keamanan', icon: '🔐', count: 6, description: 'Tools keamanan, VPN, dan proteksi data' }
	];
</script>

<svelte:head>
	<title>Kategori - TokoApps</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-2">Kategori Aplikasi</h1>
	<p class="text-base-content/60 mb-8">Jelajahi aplikasi berdasarkan kategori</p>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each categories as category}
			<a href="/apps?category={category.name}" class="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200 hover:-translate-y-1">
				<div class="card-body">
					<div class="flex items-center gap-4">
						<span class="text-4xl">{category.icon}</span>
						<div>
							<h2 class="card-title text-lg">{category.name}</h2>
							<p class="text-sm text-base-content/60">{category.count} aplikasi</p>
						</div>
					</div>
					<p class="text-sm text-base-content/70 mt-2">{category.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
