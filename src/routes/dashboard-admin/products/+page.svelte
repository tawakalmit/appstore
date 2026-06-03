<script lang="ts">
	import { onMount } from 'svelte';
	import type { App, Category } from '$lib/types';

	let products = $state<App[]>([]);
	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editMode = $state(false);
	let deleteConfirm = $state<string | null>(null);
	let uploading = $state(false);

	// Form state
	let form = $state({
		id: '',
		name: '',
		slug: '',
		description: '',
		short_description: '',
		type: 'apk' as 'apk' | 'webapp',
		price: 0,
		icon_url: '',
		screenshots: [] as string[],
		category: '',
		developer: '',
		version: '1.0.0',
		download_url: '',
		demo_url: ''
	});

	// Preview state
	let iconPreview = $state('');
	let screenshotPreviews = $state<string[]>([]);

	onMount(() => {
		loadProducts();
		loadCategories();
	});

	async function loadProducts() {
		loading = true;
		const res = await fetch('/dashboard-admin/api/products');
		if (res.ok) {
			products = await res.json();
		}
		loading = false;
	}

	async function loadCategories() {
		const res = await fetch('/dashboard-admin/api/categories');
		if (res.ok) {
			categories = await res.json();
		}
	}

	function openCreate() {
		editMode = false;
		form = {
			id: '',
			name: '',
			slug: '',
			description: '',
			short_description: '',
			type: 'apk',
			price: 0,
			icon_url: '',
			screenshots: [],
			category: '',
			developer: '',
			version: '1.0.0',
			download_url: '',
			demo_url: ''
		};
		iconPreview = '';
		screenshotPreviews = [];
		showModal = true;
	}

	function openEdit(product: App) {
		editMode = true;
		form = {
			id: product.id,
			name: product.name,
			slug: product.slug,
			description: product.description,
			short_description: product.short_description,
			type: product.type,
			price: product.price,
			icon_url: product.icon_url,
			screenshots: product.screenshots || [],
			category: product.category,
			developer: product.developer,
			version: product.version,
			download_url: product.download_url,
			demo_url: product.demo_url || ''
		};
		iconPreview = product.icon_url || '';
		screenshotPreviews = product.screenshots || [];
		showModal = true;
	}

	async function uploadFile(file: File, folder: string): Promise<string | null> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('folder', folder);

		const res = await fetch('/dashboard-admin/api/upload', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const data = await res.json();
			return data.url;
		}
		return null;
	}

	async function handleIconUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Show local preview immediately
		iconPreview = URL.createObjectURL(file);
		uploading = true;

		const url = await uploadFile(file, 'icons');
		if (url) {
			form.icon_url = url;
			iconPreview = url;
		}
		uploading = false;
	}

	async function handleScreenshotUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		if (!files || files.length === 0) return;

		uploading = true;

		for (const file of Array.from(files)) {
			// Show local preview immediately
			const localPreview = URL.createObjectURL(file);
			screenshotPreviews = [...screenshotPreviews, localPreview];

			const url = await uploadFile(file, 'screenshots');
			if (url) {
				form.screenshots = [...form.screenshots, url];
			} else {
				// Upload failed, remove the preview
				screenshotPreviews = screenshotPreviews.filter(p => p !== localPreview);
			}
		}

		// Sync previews with actual uploaded URLs
		screenshotPreviews = [...form.screenshots];
		uploading = false;
		// Reset input
		input.value = '';
	}

	function removeScreenshot(index: number) {
		form.screenshots = form.screenshots.filter((_, i) => i !== index);
		screenshotPreviews = form.screenshots;
	}

	function removeIcon() {
		form.icon_url = '';
		iconPreview = '';
	}

	async function handleSubmit() {
		const method = editMode ? 'PUT' : 'POST';
		const body = editMode ? form : { ...form, id: undefined };

		const res = await fetch('/dashboard-admin/api/products', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (res.ok) {
			showModal = false;
			await loadProducts();
		}
	}

	async function handleDelete(id: string) {
		const res = await fetch('/dashboard-admin/api/products', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		if (res.ok) {
			deleteConfirm = null;
			await loadProducts();
		}
	}

	function formatPrice(price: number): string {
		if (price === 0) return 'Gratis';
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
	}

	function generateSlug() {
		form.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold">Kelola Produk</h1>
		<button class="btn btn-primary btn-sm" onclick={openCreate}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Produk
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if products.length === 0}
		<div class="text-center py-12">
			<div class="text-5xl mb-4">📦</div>
			<p class="text-base-content/60">Belum ada produk. Mulai tambahkan produk pertama Anda!</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-zebra bg-base-100 rounded-box shadow">
				<thead>
					<tr>
						<th>Nama</th>
						<th>Tipe</th>
						<th>Kategori</th>
						<th>Harga</th>
						<th>Versi</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each products as product}
						<tr>
							<td>
								<div class="flex items-center gap-3">
									{#if product.icon_url}
										<img src={product.icon_url} alt={product.name} class="w-10 h-10 rounded-lg object-cover" />
									{:else}
										<div class="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center text-lg">📱</div>
									{/if}
									<div>
										<div class="font-medium">{product.name}</div>
										<div class="text-xs text-base-content/50">{product.slug}</div>
									</div>
								</div>
							</td>
							<td>
								<span class="badge badge-sm" class:badge-primary={product.type === 'apk'} class:badge-secondary={product.type === 'webapp'}>
									{product.type === 'apk' ? 'APK' : 'Web App'}
								</span>
							</td>
							<td>{product.category}</td>
							<td>{formatPrice(product.price)}</td>
							<td>{product.version}</td>
							<td>
								<div class="flex gap-1">
									<button class="btn btn-ghost btn-xs" onclick={() => openEdit(product)}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</button>
									<button class="btn btn-ghost btn-xs text-error" onclick={() => deleteConfirm = product.id}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Product Modal -->
{#if showModal}
	<div class="modal modal-open">
		<div class="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
			<h3 class="font-bold text-lg mb-4">{editMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="prod-name"><span class="label-text">Nama Produk</span></label>
						<input id="prod-name" type="text" class="input input-bordered" bind:value={form.name} oninput={generateSlug} required />
					</div>
					<div class="form-control">
						<label class="label" for="prod-slug"><span class="label-text">Slug</span></label>
						<input id="prod-slug" type="text" class="input input-bordered" bind:value={form.slug} required />
					</div>
					<div class="form-control">
						<label class="label" for="prod-type"><span class="label-text">Tipe</span></label>
						<select id="prod-type" class="select select-bordered" bind:value={form.type}>
							<option value="apk">APK</option>
							<option value="webapp">Web App</option>
						</select>
					</div>
					<div class="form-control">
						<label class="label" for="prod-price"><span class="label-text">Harga (Rp)</span></label>
						<input id="prod-price" type="number" class="input input-bordered" bind:value={form.price} min="0" />
					</div>
					<div class="form-control">
						<label class="label" for="prod-category"><span class="label-text">Kategori</span></label>
						<select id="prod-category" class="select select-bordered" bind:value={form.category} required>
							<option value="" disabled>Pilih Kategori</option>
							{#each categories as cat}
								<option value={cat.name}>{cat.name}</option>
							{/each}
						</select>
					</div>
					<div class="form-control">
						<label class="label" for="prod-developer"><span class="label-text">Developer</span></label>
						<input id="prod-developer" type="text" class="input input-bordered" bind:value={form.developer} />
					</div>
					<div class="form-control">
						<label class="label" for="prod-version"><span class="label-text">Versi</span></label>
						<input id="prod-version" type="text" class="input input-bordered" bind:value={form.version} />
					</div>
					<div class="form-control">
						<label class="label"><span class="label-text">Harga (Info)</span></label>
						<input type="text" class="input input-bordered" value={formatPrice(form.price)} disabled />
					</div>

					<!-- Icon Upload -->
					<div class="form-control md:col-span-2">
						<label class="label"><span class="label-text">Icon Produk</span></label>
						<div class="flex items-start gap-4">
							{#if iconPreview}
								<div class="relative">
									<img src={iconPreview} alt="Icon preview" class="w-20 h-20 rounded-xl object-cover border border-base-300" />
									<button type="button" class="btn btn-circle btn-xs btn-error absolute -top-2 -right-2" onclick={removeIcon}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							{/if}
							<label class="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-base-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								<span class="text-xs text-base-content/40 mt-1">Upload</span>
								<input type="file" class="hidden" accept="image/*" onchange={handleIconUpload} />
							</label>
						</div>
					</div>

					<!-- Screenshots Upload -->
					<div class="form-control md:col-span-2">
						<label class="label"><span class="label-text">Screenshots</span></label>
						<div class="flex flex-wrap items-start gap-3">
							{#each screenshotPreviews as screenshot, i}
								<div class="relative">
									<img src={screenshot} alt="Screenshot {i + 1}" class="w-28 h-20 rounded-lg object-cover border border-base-300" />
									<button type="button" class="btn btn-circle btn-xs btn-error absolute -top-2 -right-2" onclick={() => removeScreenshot(i)}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							{/each}
							<label class="flex flex-col items-center justify-center w-28 h-20 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span class="text-xs text-base-content/40 mt-1">Tambah</span>
								<input type="file" class="hidden" accept="image/*" multiple onchange={handleScreenshotUpload} />
							</label>
						</div>
					</div>

					<div class="form-control md:col-span-2">
						<label class="label" for="prod-short-desc"><span class="label-text">Deskripsi Singkat</span></label>
						<input id="prod-short-desc" type="text" class="input input-bordered" bind:value={form.short_description} />
					</div>
					<div class="form-control md:col-span-2">
						<label class="label" for="prod-desc"><span class="label-text">Deskripsi Lengkap</span></label>
						<textarea id="prod-desc" class="textarea textarea-bordered h-24" bind:value={form.description}></textarea>
					</div>
					<div class="form-control">
						<label class="label" for="prod-download"><span class="label-text">Download URL</span></label>
						<input id="prod-download" type="text" class="input input-bordered" bind:value={form.download_url} />
					</div>
					<div class="form-control">
						<label class="label" for="prod-demo"><span class="label-text">Demo URL</span></label>
						<input id="prod-demo" type="text" class="input input-bordered" bind:value={form.demo_url} />
					</div>
				</div>

				{#if uploading}
					<div class="mt-4 flex items-center gap-2 text-sm text-base-content/60">
						<span class="loading loading-spinner loading-xs"></span>
						Mengupload file...
					</div>
				{/if}

				<div class="modal-action">
					<button type="button" class="btn" onclick={() => showModal = false}>Batal</button>
					<button type="submit" class="btn btn-primary" disabled={uploading}>{editMode ? 'Simpan' : 'Tambah'}</button>
				</div>
			</form>
		</div>
		<div class="modal-backdrop" onclick={() => showModal = false}></div>
	</div>
{/if}

<!-- Delete Confirm Modal -->
{#if deleteConfirm}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Hapus Produk</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak bisa dibatalkan.</p>
			<div class="modal-action">
				<button class="btn" onclick={() => deleteConfirm = null}>Batal</button>
				<button class="btn btn-error" onclick={() => handleDelete(deleteConfirm!)}>Hapus</button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={() => deleteConfirm = null}></div>
	</div>
{/if}
