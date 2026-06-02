<script lang="ts">
	import { onMount } from 'svelte';
	import type { Category } from '$lib/types';

	let categories = $state<Category[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editMode = $state(false);
	let deleteConfirm = $state<string | null>(null);

	let form = $state({
		id: '',
		name: '',
		slug: '',
		icon: '📦'
	});

	onMount(() => {
		loadCategories();
	});

	async function loadCategories() {
		loading = true;
		const res = await fetch('/dashboard-admin/api/categories');
		if (res.ok) {
			categories = await res.json();
		}
		loading = false;
	}

	function openCreate() {
		editMode = false;
		form = { id: '', name: '', slug: '', icon: '📦' };
		showModal = true;
	}

	function openEdit(category: Category) {
		editMode = true;
		form = { ...category };
		showModal = true;
	}

	async function handleSubmit() {
		const method = editMode ? 'PUT' : 'POST';
		const body = editMode ? form : { ...form, id: undefined };

		const res = await fetch('/dashboard-admin/api/categories', {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (res.ok) {
			showModal = false;
			await loadCategories();
		}
	}

	async function handleDelete(id: string) {
		const res = await fetch('/dashboard-admin/api/categories', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		if (res.ok) {
			deleteConfirm = null;
			await loadCategories();
		}
	}

	function generateSlug() {
		form.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold">Kelola Kategori</h1>
		<button class="btn btn-primary btn-sm" onclick={openCreate}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Kategori
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if categories.length === 0}
		<div class="text-center py-12">
			<div class="text-5xl mb-4">🏷️</div>
			<p class="text-base-content/60">Belum ada kategori. Mulai tambahkan kategori pertama Anda!</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each categories as category}
				<div class="card bg-base-100 shadow border border-base-200">
					<div class="card-body p-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="text-2xl">{category.icon}</span>
								<div>
									<h3 class="font-semibold">{category.name}</h3>
									<p class="text-xs text-base-content/50">{category.slug}</p>
								</div>
							</div>
							<div class="flex gap-1">
								<button class="btn btn-ghost btn-xs" onclick={() => openEdit(category)}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button class="btn btn-ghost btn-xs text-error" onclick={() => deleteConfirm = category.id}>
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

<!-- Category Modal -->
{#if showModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg mb-4">{editMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				<div class="form-control mb-3">
					<label class="label" for="cat-icon"><span class="label-text">Icon (emoji)</span></label>
					<input id="cat-icon" type="text" class="input input-bordered w-20 text-center text-xl" bind:value={form.icon} maxlength="4" />
				</div>
				<div class="form-control mb-3">
					<label class="label" for="cat-name"><span class="label-text">Nama Kategori</span></label>
					<input id="cat-name" type="text" class="input input-bordered" bind:value={form.name} oninput={generateSlug} required />
				</div>
				<div class="form-control mb-3">
					<label class="label" for="cat-slug"><span class="label-text">Slug</span></label>
					<input id="cat-slug" type="text" class="input input-bordered" bind:value={form.slug} required />
				</div>

				<div class="modal-action">
					<button type="button" class="btn" onclick={() => showModal = false}>Batal</button>
					<button type="submit" class="btn btn-primary">{editMode ? 'Simpan' : 'Tambah'}</button>
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
			<h3 class="font-bold text-lg">Hapus Kategori</h3>
			<p class="py-4">Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak bisa dibatalkan.</p>
			<div class="modal-action">
				<button class="btn" onclick={() => deleteConfirm = null}>Batal</button>
				<button class="btn btn-error" onclick={() => handleDelete(deleteConfirm!)}>Hapus</button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={() => deleteConfirm = null}></div>
	</div>
{/if}
