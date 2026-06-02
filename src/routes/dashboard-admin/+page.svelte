<script lang="ts">
	import { onMount } from 'svelte';
	import type { App, Category } from '$lib/types';

	let totalProducts = $state(0);
	let totalCategories = $state(0);

	onMount(async () => {
		const [prodRes, catRes] = await Promise.all([
			fetch('/dashboard-admin/api/products'),
			fetch('/dashboard-admin/api/categories')
		]);
		if (prodRes.ok) {
			const products = await prodRes.json();
			totalProducts = products.length;
		}
		if (catRes.ok) {
			const categories = await catRes.json();
			totalCategories = categories.length;
		}
	});
</script>

<div>
	<h1 class="text-2xl font-bold mb-6">Selamat Datang, Admin!</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<div class="stat bg-base-100 rounded-box shadow border border-base-200">
			<div class="stat-figure text-primary">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
				</svg>
			</div>
			<div class="stat-title">Total Produk</div>
			<div class="stat-value text-primary">{totalProducts}</div>
		</div>

		<div class="stat bg-base-100 rounded-box shadow border border-base-200">
			<div class="stat-figure text-secondary">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
				</svg>
			</div>
			<div class="stat-title">Total Kategori</div>
			<div class="stat-value text-secondary">{totalCategories}</div>
		</div>

		<div class="stat bg-base-100 rounded-box shadow border border-base-200">
			<div class="stat-figure text-accent">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
				</svg>
			</div>
			<div class="stat-title">Status</div>
			<div class="stat-value text-accent text-lg">Aktif</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<a href="/dashboard-admin/products" class="card bg-base-100 shadow border border-base-200 hover:shadow-md transition-shadow">
			<div class="card-body">
				<h2 class="card-title">Kelola Produk</h2>
				<p class="text-base-content/60">Tambah, edit, atau hapus produk aplikasi.</p>
				<div class="card-actions justify-end">
					<span class="btn btn-primary btn-sm">Buka →</span>
				</div>
			</div>
		</a>

		<a href="/dashboard-admin/categories" class="card bg-base-100 shadow border border-base-200 hover:shadow-md transition-shadow">
			<div class="card-body">
				<h2 class="card-title">Kelola Kategori</h2>
				<p class="text-base-content/60">Tambah, edit, atau hapus kategori produk.</p>
				<div class="card-actions justify-end">
					<span class="btn btn-secondary btn-sm">Buka →</span>
				</div>
			</div>
		</a>
	</div>
</div>
