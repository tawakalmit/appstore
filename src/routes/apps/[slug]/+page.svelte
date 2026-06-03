<script lang="ts">
	import type { App } from '$lib/types';
	import { PUBLIC_MIDTRANS_CLIENT_KEY, PUBLIC_MIDTRANS_IS_PRODUCTION } from '$env/static/public';

	let { data } = $props();
	const app: App = data.app;

	let showCheckout = $state(false);
	let checkoutLoading = $state(false);
	let checkoutError = $state('');

	let checkout = $state({
		name: '',
		email: '',
		phone: ''
	});

	function formatPrice(price: number): string {
		if (price === 0) return 'Gratis';
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
	}

	function openCheckout() {
		if (app.price === 0) {
			// Free app - direct download
			if (app.download_url) {
				window.open(app.download_url, '_blank');
			}
			return;
		}
		showCheckout = true;
		checkoutError = '';
	}

	async function handleCheckout() {
		checkoutLoading = true;
		checkoutError = '';

		try {
			const res = await fetch('/dashboard-admin/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: checkout.name,
					email: checkout.email,
					phone: checkout.phone,
					product_name: app.name,
					product_id: app.id,
					price: app.price
				})
			});

			if (!res.ok) {
				const data = await res.json();
				checkoutError = data.message || 'Gagal memproses pembayaran';
				checkoutLoading = false;
				return;
			}

			const { token, order_id: orderId } = await res.json();

			// Open Midtrans Snap popup
			(window as any).snap.pay(token, {
				onSuccess: () => {
					showCheckout = false;
					window.location.href = `/order/status?order_id=${orderId}`;
				},
				onPending: () => {
					showCheckout = false;
					window.location.href = `/order/status?order_id=${orderId}`;
				},
				onError: () => {
					checkoutError = 'Pembayaran gagal. Silakan coba lagi.';
				},
				onClose: () => {
					// User closed the popup
				}
			});
		} catch (e) {
			checkoutError = 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			checkoutLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{app.name} - TokoApps</title>
	<script
		src={PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
			? 'https://app.midtrans.com/snap/snap.js'
			: 'https://app.sandbox.midtrans.com/snap/snap.js'}
		data-client-key={PUBLIC_MIDTRANS_CLIENT_KEY}
	></script>
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
				{#if app.icon_url}
					<img src={app.icon_url} alt={app.name} class="w-24 h-24 rounded-2xl shadow-md object-cover" />
				{:else}
					<div class="w-24 h-24 rounded-2xl shadow-md bg-base-200 flex items-center justify-center text-3xl">📱</div>
				{/if}
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
					<p class="font-bold text-lg">{app.type === 'apk' ? 'Android' : 'Browser'}</p>
					<p class="text-xs text-base-content/50">Platform</p>
				</div>
				<div class="text-center">
					<p class="font-bold text-lg">v{app.version}</p>
					<p class="text-xs text-base-content/50">Versi</p>
				</div>
				<div class="text-center">
					<p class="font-bold text-lg">{app.category}</p>
					<p class="text-xs text-base-content/50">Kategori</p>
				</div>
			</div>

			<!-- Screenshots -->
			{#if app.screenshots && app.screenshots.length > 0}
				<div class="mb-8">
					<h2 class="text-xl font-bold mb-4">Screenshots</h2>
					<div class="flex gap-4 overflow-x-auto pb-4">
						{#each app.screenshots as screenshot, i}
							<img src={screenshot} alt="Screenshot {i + 1}" class="rounded-xl h-64 object-cover shadow-sm" />
						{/each}
					</div>
				</div>
			{/if}

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
					
					<button class="btn btn-primary btn-block" onclick={openCheckout}>
						{#if app.price === 0}
							Download Gratis
						{:else}
							Beli Sekarang
						{/if}
					</button>
					
					{#if app.demo_url}
						<a href={`https://wa.me/6285156837220?text=${encodeURIComponent(`Halo, saya ingin request demo untuk aplikasi "${app.name}". Terima kasih.`)}`} target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block">
							Request Demo
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

<!-- Checkout Modal -->
{#if showCheckout}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg mb-2">Checkout</h3>
			<p class="text-sm text-base-content/60 mb-4">Lengkapi data berikut untuk membeli <strong>{app.name}</strong></p>

			<!-- Order Summary -->
			<div class="bg-base-200 rounded-lg p-4 mb-4">
				<div class="flex items-center gap-3">
					{#if app.icon_url}
						<img src={app.icon_url} alt={app.name} class="w-12 h-12 rounded-lg object-cover" />
					{:else}
						<div class="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center">📱</div>
					{/if}
					<div class="flex-1">
						<p class="font-medium text-sm">{app.name}</p>
						<p class="text-xs text-base-content/50">{app.type === 'apk' ? 'APK' : 'Web App'}</p>
					</div>
					<p class="font-bold text-primary">{formatPrice(app.price)}</p>
				</div>
			</div>

			{#if checkoutError}
				<div class="alert alert-error text-sm mb-4">
					<span>{checkoutError}</span>
				</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
				<div class="form-control mb-3">
					<label class="label" for="checkout-name"><span class="label-text">Nama Lengkap</span></label>
					<input id="checkout-name" type="text" class="input input-bordered" bind:value={checkout.name} placeholder="Nama lengkap Anda" required />
				</div>
				<div class="form-control mb-3">
					<label class="label" for="checkout-email"><span class="label-text">Email</span></label>
					<input id="checkout-email" type="email" class="input input-bordered" bind:value={checkout.email} placeholder="email@contoh.com" required />
				</div>
				<div class="form-control mb-4">
					<label class="label" for="checkout-phone"><span class="label-text">Nomor HP / WhatsApp</span></label>
					<input id="checkout-phone" type="tel" class="input input-bordered" bind:value={checkout.phone} placeholder="08xxxxxxxxxx" required />
				</div>

				<div class="modal-action">
					<button type="button" class="btn" onclick={() => showCheckout = false}>Batal</button>
					<button type="submit" class="btn btn-primary" disabled={checkoutLoading}>
						{#if checkoutLoading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						Bayar {formatPrice(app.price)}
					</button>
				</div>
			</form>
		</div>
		<div class="modal-backdrop" onclick={() => showCheckout = false}></div>
	</div>
{/if}
