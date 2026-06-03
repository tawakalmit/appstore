<script lang="ts">
	import { onMount } from 'svelte';
	import type { Banner } from '$lib/types';

	let banners = $state<Banner[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editMode = $state(false);
	let deleteConfirm = $state<string | null>(null);
	let uploading = $state(false);

	let form = $state({
		id: '',
		headline: '',
		description: '',
		btn_text: '',
		btn_link: '',
		desktop_image: '',
		mobile_image: '',
		icon_url: '',
		icon_text: '',
		text_color: 'dark' as 'dark' | 'light',
		sort_order: 0,
		active: true
	});

	let desktopPreview = $state('');
	let mobilePreview = $state('');
	let iconPreview = $state('');

	onMount(() => {
		loadBanners();
	});

	async function loadBanners() {
		loading = true;
		const res = await fetch('/dashboard-admin/api/banners');
		if (res.ok) {
			banners = await res.json();
		}
		loading = false;
	}

	function openCreate() {
		editMode = false;
		form = {
			id: '',
			headline: '',
			description: '',
			btn_text: 'Selengkapnya',
			btn_link: '/apps',
			desktop_image: '',
			mobile_image: '',
			icon_url: '',
			icon_text: '',
			text_color: 'dark' as 'dark' | 'light',
			sort_order: banners.length,
			active: true
		};
		desktopPreview = '';
		mobilePreview = '';
		iconPreview = '';
		showModal = true;
	}

	function openEdit(banner: Banner) {
		editMode = true;
		form = { ...banner };
		desktopPreview = banner.desktop_image;
		mobilePreview = banner.mobile_image;
		iconPreview = banner.icon_url || '';
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

	async function handleDesktopUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		desktopPreview = URL.createObjectURL(file);
		uploading = true;
		const url = await uploadFile(file, 'banners/desktop');
		if (url) {
			form.desktop_image = url;
			desktopPreview = url;
		}
		uploading = false;
	}

	async function handleMobileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		mobilePreview = URL.createObjectURL(file);
		uploading = true;
		const url = await uploadFile(file, 'banners/mobile');
		if (url) {
			form.mobile_image = url;
			mobilePreview = url;
		}
		uploading = false;
	}

	async function handleIconUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		iconPreview = URL.createObjectURL(file);
		uploading = true;
		const url = await uploadFile(file, 'banners/icons');
		if (url) {
			form.icon_url = url;
			iconPreview = url;
		}
		uploading = false;
	}

	async function handleSubmit() {
		const method = editMode ? 'PUT' : 'POST';
		const body = editMode ? form : { ...form, id: undefined };

		const res = await fetch('/dashboard-admin/api/banners', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (res.ok) {
			showModal = false;
			await loadBanners();
		}
	}

	async function handleDelete(id: string) {
		const res = await fetch('/dashboard-admin/api/banners', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		if (res.ok) {
			deleteConfirm = null;
			await loadBanners();
		}
	}

	async function toggleActive(banner: Banner) {
		await fetch('/dashboard-admin/api/banners', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: banner.id, active: !banner.active })
		});
		await loadBanners();
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold">Kelola Banner</h1>
		<button class="btn btn-primary btn-sm" onclick={openCreate}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Banner
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if banners.length === 0}
		<div class="text-center py-12">
			<div class="text-5xl mb-4">🖼️</div>
			<p class="text-base-content/60">Belum ada banner. Tambahkan banner pertama untuk homepage.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4">
			{#each banners as banner}
				<div class="card card-side bg-base-100 shadow border border-base-200">
					<figure class="w-48 shrink-0">
						{#if banner.desktop_image}
							<img src={banner.desktop_image} alt={banner.headline} class="w-full h-32 object-cover" />
						{:else}
							<div class="w-full h-32 bg-base-200 flex items-center justify-center text-2xl">🖼️</div>
						{/if}
					</figure>
					<div class="card-body p-4">
						<div class="flex items-start justify-between">
							<div>
								<h3 class="font-bold text-sm">{banner.headline}</h3>
								<p class="text-xs text-base-content/60 mt-1">{banner.description}</p>
								<div class="flex items-center gap-2 mt-2">
									<span class="badge badge-xs" class:badge-success={banner.active} class:badge-ghost={!banner.active}>
										{banner.active ? 'Aktif' : 'Nonaktif'}
									</span>
									<span class="text-xs text-base-content/40">Urutan: {banner.sort_order}</span>
								</div>
							</div>
							<div class="flex gap-1">
								<button class="btn btn-ghost btn-xs" onclick={() => toggleActive(banner)}>
									{#if banner.active}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
										</svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									{/if}
								</button>
								<button class="btn btn-ghost btn-xs" onclick={() => openEdit(banner)}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button class="btn btn-ghost btn-xs text-error" onclick={() => deleteConfirm = banner.id}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Banner Modal -->
{#if showModal}
	<div class="modal modal-open">
		<div class="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
			<h3 class="font-bold text-lg mb-4">{editMode ? 'Edit Banner' : 'Tambah Banner Baru'}</h3>
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control md:col-span-2">
						<label class="label" for="banner-headline"><span class="label-text">Headline</span></label>
						<input id="banner-headline" type="text" class="input input-bordered" bind:value={form.headline} required />
					</div>
					<div class="form-control md:col-span-2">
						<label class="label" for="banner-desc"><span class="label-text">Deskripsi</span></label>
						<input id="banner-desc" type="text" class="input input-bordered" bind:value={form.description} />
					</div>
					<div class="form-control">
						<label class="label" for="banner-btn-text"><span class="label-text">Teks Tombol</span></label>
						<input id="banner-btn-text" type="text" class="input input-bordered" bind:value={form.btn_text} />
					</div>
					<div class="form-control">
						<label class="label" for="banner-btn-link"><span class="label-text">Link Tombol</span></label>
						<input id="banner-btn-link" type="text" class="input input-bordered" bind:value={form.btn_link} />
					</div>
					<div class="form-control">
						<label class="label" for="banner-order"><span class="label-text">Urutan</span></label>
						<input id="banner-order" type="number" class="input input-bordered" bind:value={form.sort_order} min="0" />
					</div>
					<div class="form-control">
						<label class="label"><span class="label-text">Status</span></label>
						<label class="label cursor-pointer justify-start gap-3">
							<input type="checkbox" class="toggle toggle-primary" bind:checked={form.active} />
							<span class="label-text">{form.active ? 'Aktif' : 'Nonaktif'}</span>
						</label>
					</div>
					<div class="form-control">
						<label class="label"><span class="label-text">Warna Teks</span></label>
						<div class="flex gap-4">
							<label class="label cursor-pointer gap-2">
								<input type="radio" name="text_color" class="radio radio-sm" value="dark" bind:group={form.text_color} />
								<span class="label-text flex items-center gap-1">
									<span class="w-4 h-4 rounded-full bg-gray-900 border border-base-300 inline-block"></span>
									Hitam
								</span>
							</label>
							<label class="label cursor-pointer gap-2">
								<input type="radio" name="text_color" class="radio radio-sm" value="light" bind:group={form.text_color} />
								<span class="label-text flex items-center gap-1">
									<span class="w-4 h-4 rounded-full bg-white border border-base-300 inline-block"></span>
									Putih
								</span>
							</label>
						</div>
					</div>

					<!-- Icon Branding Upload -->
					<div class="form-control md:col-span-2">
						<label class="label"><span class="label-text">Icon Branding (logo kecil di card)</span></label>
						<div class="flex items-start gap-4">
							{#if iconPreview}
								<img src={iconPreview} alt="Icon preview" class="w-14 h-14 rounded-lg object-contain border border-base-300 bg-white p-1" />
							{/if}
							<label class="flex flex-col items-center justify-center w-14 h-14 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
								<input type="file" class="hidden" accept="image/*" onchange={handleIconUpload} />
							</label>
						</div>
					</div>
					<div class="form-control md:col-span-2">
						<label class="label" for="banner-icon-text"><span class="label-text">Icon Text (teks di sebelah kanan icon, misal: nama brand)</span></label>
						<input id="banner-icon-text" type="text" class="input input-bordered" bind:value={form.icon_text} placeholder="contoh: cashy" />
					</div>

					<!-- Desktop Image Upload -->
					<div class="form-control md:col-span-2">
						<label class="label"><span class="label-text">Gambar Desktop (landscape, 1920x1080 recommended)</span></label>
						<div class="flex items-start gap-4">
							{#if desktopPreview}
								<img src={desktopPreview} alt="Desktop preview" class="w-48 h-28 rounded-lg object-cover border border-base-300" />
							{/if}
							<label class="flex flex-col items-center justify-center w-48 h-28 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span class="text-xs text-base-content/40 mt-1">Upload Desktop</span>
								<input type="file" class="hidden" accept="image/*" onchange={handleDesktopUpload} />
							</label>
						</div>
					</div>

					<!-- Mobile Image Upload -->
					<div class="form-control md:col-span-2">
						<label class="label"><span class="label-text">Gambar Mobile (portrait, 768x1024 recommended)</span></label>
						<div class="flex items-start gap-4">
							{#if mobilePreview}
								<img src={mobilePreview} alt="Mobile preview" class="w-24 h-36 rounded-lg object-cover border border-base-300" />
							{/if}
							<label class="flex flex-col items-center justify-center w-24 h-36 border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								<span class="text-xs text-base-content/40 mt-1">Upload Mobile</span>
								<input type="file" class="hidden" accept="image/*" onchange={handleMobileUpload} />
							</label>
						</div>
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
			<h3 class="font-bold text-lg">Hapus Banner</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus banner ini?</p>
			<div class="modal-action">
				<button class="btn" onclick={() => deleteConfirm = null}>Batal</button>
				<button class="btn btn-error" onclick={() => handleDelete(deleteConfirm!)}>Hapus</button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={() => deleteConfirm = null}></div>
	</div>
{/if}
