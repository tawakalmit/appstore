<script lang="ts">
	import '../../app.css';
	let { children } = $props();
	let sidebarOpen = $state(true);

	async function handleLogout() {
		await fetch('/masteradmin/logout', { method: 'POST' });
		window.location.href = '/masteradmin';
	}
</script>

<svelte:head>
	<title>Dashboard Admin - TokoApps</title>
</svelte:head>

<div class="min-h-screen flex bg-base-200">
	<!-- Sidebar -->
	<aside class="w-64 bg-base-100 border-r border-base-200 flex flex-col {sidebarOpen ? '' : 'hidden'} lg:flex">
		<div class="p-4 border-b border-base-200">
			<a href="/dashboard-admin" class="flex items-center gap-2 text-lg font-bold">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
				TokoApps
			</a>
			<p class="text-xs text-base-content/50 mt-1">Admin Panel</p>
		</div>

		<nav class="flex-1 p-4">
			<ul class="menu menu-sm gap-1">
				<li class="menu-title">Menu</li>
				<li>
					<a href="/dashboard-admin" class="flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						Dashboard
					</a>
				</li>
				<li>
					<a href="/dashboard-admin/products" class="flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
						</svg>
						Produk
					</a>
				</li>
				<li>
					<a href="/dashboard-admin/categories" class="flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
						</svg>
						Kategori
					</a>
				</li>
				<li>
					<a href="/dashboard-admin/banners" class="flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						Banner
					</a>
				</li>
				<li>
					<a href="/dashboard-admin/orders" class="flex items-center gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
						Pesanan
					</a>
				</li>
			</ul>
		</nav>

		<div class="p-4 border-t border-base-200">
			<button onclick={handleLogout} class="btn btn-ghost btn-sm btn-block justify-start gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
				</svg>
				Logout
			</button>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex-1 flex flex-col">
		<!-- Top bar -->
		<header class="bg-base-100 border-b border-base-200 p-4 flex items-center gap-4">
			<button class="btn btn-ghost btn-sm lg:hidden" onclick={() => sidebarOpen = !sidebarOpen}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<h2 class="text-lg font-semibold">Admin Dashboard</h2>
		</header>

		<!-- Page content -->
		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</div>
</div>
