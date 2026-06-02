<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<!-- Navbar -->
	<div class="navbar bg-base-100 shadow-sm border-b border-base-200">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
					</svg>
				</div>
				<ul tabindex="-1" role="menu" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
					<li><a href="/">Beranda</a></li>
					<li><a href="/apps">Semua Apps</a></li>
					<li><a href="/categories">Kategori</a></li>
				</ul>
			</div>
			<a href="/" class="btn btn-ghost text-xl font-bold">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
				TokoApps
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1 gap-1">
				<li><a href="/" class="font-medium">Beranda</a></li>
				<li><a href="/apps" class="font-medium">Semua Apps</a></li>
				<li><a href="/categories" class="font-medium">Kategori</a></li>
			</ul>
		</div>
		<div class="navbar-end gap-2">
			<div class="form-control">
				<input type="text" placeholder="Cari aplikasi..." class="input input-bordered w-24 md:w-auto" />
			</div>
			<a href="/login" class="btn btn-primary btn-sm">Masuk</a>
		</div>
	</div>

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="footer footer-center bg-base-200 text-base-content p-10">
		<aside>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
			</svg>
			<p class="font-bold">TokoApps</p>
			<p>Marketplace Aplikasi APK & Web Apps Terpercaya</p>
			<p>Copyright © 2024 - All rights reserved</p>
		</aside>
	</footer>
</div>
