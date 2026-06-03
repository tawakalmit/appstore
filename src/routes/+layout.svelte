<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();

	let theme = $state('corporate');

	onMount(() => {
		theme = localStorage.getItem('theme') || 'corporate';
		document.documentElement.setAttribute('data-theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'corporate' ? 'dim' : 'corporate';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}
</script>

<div class="min-h-screen flex flex-col">
	<!-- Navbar -->
	<div class="w-11/12 mx-auto rounded-full navbar bg-base-100 shadow-sm border-b border-base-200 fixed top-5 left-0 right-0 z-50">
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost text-xl font-bold">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
				TokoApps
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
		</div>
		<div class="navbar-end gap-2">
			<a href="/apps" class="btn btn-ghost btn-sm font-medium hidden lg:inline-flex">Apps</a>
			<button class="btn btn-ghost btn-circle btn-sm" onclick={toggleTheme} aria-label="Toggle tema">
				{#if theme === 'corporate'}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
					</svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				{/if}
			</button>
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
					</svg>
				</div>
				<ul tabindex="-1" role="menu" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-fit p-2 shadow">
					<!-- <li><a href="/">Beranda</a></li> -->
					<li><a href="/apps">Apps</a></li>
					<!-- <li><a href="/categories">Kategori</a></li> -->
				</ul>
			</div>
		</div>
	</div>

	<!-- Spacer for fixed navbar -->
	<div class="h-12"></div>

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
