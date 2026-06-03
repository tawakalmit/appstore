<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let orderId = $state(page.url.searchParams.get('order_id') || '');
	let loading = $state(false);
	let error = $state('');
	let status = $state<any>(null);

	onMount(() => {
		if (orderId) {
			checkStatus();
		}
	});

	async function checkStatus() {
		if (!orderId.trim()) {
			error = 'Masukkan Order ID';
			return;
		}

		loading = true;
		error = '';
		status = null;

		try {
			const res = await fetch('/dashboard-admin/api/checkout/status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ order_id: orderId.trim() })
			});

			if (!res.ok) {
				const data = await res.json();
				error = data.message || 'Gagal mengecek status';
				loading = false;
				return;
			}

			status = await res.json();
		} catch (e) {
			error = 'Terjadi kesalahan. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}

	function getStatusBadge(txStatus: string) {
		switch (txStatus) {
			case 'capture':
			case 'settlement':
				return { class: 'badge-success', text: 'Berhasil' };
			case 'pending':
				return { class: 'badge-warning', text: 'Menunggu Pembayaran' };
			case 'deny':
			case 'cancel':
			case 'expire':
				return { class: 'badge-error', text: txStatus === 'expire' ? 'Kedaluwarsa' : 'Dibatalkan' };
			case 'refund':
				return { class: 'badge-info', text: 'Dikembalikan' };
			default:
				return { class: 'badge-ghost', text: txStatus };
		}
	}

	function formatPaymentType(type: string) {
		const map: Record<string, string> = {
			'credit_card': 'Kartu Kredit',
			'bank_transfer': 'Transfer Bank',
			'echannel': 'Mandiri Bill',
			'gopay': 'GoPay',
			'shopeepay': 'ShopeePay',
			'qris': 'QRIS',
			'cstore': 'Indomaret/Alfamart',
			'akulaku': 'Akulaku',
			'bca_klikpay': 'BCA KlikPay'
		};
		return map[type] || type;
	}

	function getQrUrl(actions: any[]) {
		if (!actions) return null;
		const qrAction = actions.find((a: any) => a.name === 'generate-qr-code' || a.name === 'deeplink-redirect');
		return qrAction?.url || null;
	}

	function getDeeplinkUrl(actions: any[]) {
		if (!actions) return null;
		const deeplink = actions.find((a: any) => a.name === 'deeplink-redirect');
		return deeplink?.url || null;
	}
</script>

<svelte:head>
	<title>Cek Status Pesanan - TokoApps</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
	<div class="max-w-lg mx-auto">
		<h1 class="text-2xl font-bold mb-2 text-center">Cek Status Pesanan</h1>
		<p class="text-base-content/60 text-center mb-8">Masukkan Order ID untuk mengecek status pembayaran Anda</p>

		<div class="card bg-base-100 shadow border border-base-200">
			<div class="card-body">
				<form onsubmit={(e) => { e.preventDefault(); checkStatus(); }}>
					<div class="form-control mb-4">
						<label class="label" for="order-id"><span class="label-text">Order ID</span></label>
						<input
							id="order-id"
							type="text"
							class="input input-bordered"
							bind:value={orderId}
							placeholder="ORDER-1780459888807-lmc06n"
							required
						/>
					</div>
					<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						Cek Status
					</button>
				</form>

				{#if error}
					<div class="alert alert-error text-sm mt-4">
						<span>{error}</span>
					</div>
				{/if}

				{#if status}
					<div class="divider"></div>

					<!-- Status Info -->
					<div class="space-y-3">
						<div class="flex justify-between items-center">
							<span class="text-sm text-base-content/60">Status</span>
							<span class="badge {getStatusBadge(status.transaction_status).class}">
								{getStatusBadge(status.transaction_status).text}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-base-content/60">Order ID</span>
							<span class="text-sm font-mono text-xs">{status.order_id}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-base-content/60">Total</span>
							<span class="text-sm font-bold">Rp {Number(status.gross_amount).toLocaleString('id-ID')}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-base-content/60">Metode Bayar</span>
							<span class="text-sm">{formatPaymentType(status.payment_type)}</span>
						</div>
						{#if status.transaction_time}
							<div class="flex justify-between items-center">
								<span class="text-sm text-base-content/60">Waktu Transaksi</span>
								<span class="text-sm">{new Date(status.transaction_time).toLocaleString('id-ID')}</span>
							</div>
						{/if}
						{#if status.expiry_time && status.transaction_status === 'pending'}
							<div class="flex justify-between items-center">
								<span class="text-sm text-base-content/60">Batas Pembayaran</span>
								<span class="text-sm text-error">{new Date(status.expiry_time).toLocaleString('id-ID')}</span>
							</div>
						{/if}
					</div>

					<!-- Payment Details (pending only) -->
					{#if status.transaction_status === 'pending'}
						<div class="divider">Detail Pembayaran</div>

						<!-- QRIS / GoPay QR Code -->
						{#if status.actions && getQrUrl(status.actions)}
							<div class="text-center">
								<p class="text-sm font-medium mb-3">Scan QR Code untuk membayar:</p>
								<img src={getQrUrl(status.actions)} alt="QR Code Pembayaran" class="mx-auto w-56 h-56 rounded-lg border border-base-300" />
								{#if getDeeplinkUrl(status.actions)}
									<a href={getDeeplinkUrl(status.actions)} target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline mt-3">
										Buka Aplikasi
									</a>
								{/if}
							</div>
						{/if}

						<!-- VA Number (Bank Transfer) -->
						{#if status.va_numbers && status.va_numbers.length > 0}
							<div class="bg-base-200 rounded-lg p-4">
								<p class="text-sm font-medium mb-2">Transfer ke Virtual Account:</p>
								{#each status.va_numbers as va}
									<div class="flex justify-between items-center py-2">
										<span class="text-sm text-base-content/60 uppercase">{va.bank}</span>
										<div class="flex items-center gap-2">
											<span class="font-mono font-bold text-lg">{va.va_number}</span>
											<button class="btn btn-xs btn-ghost" onclick={() => navigator.clipboard.writeText(va.va_number)}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}

						<!-- Permata VA -->
						{#if status.permata_va_number}
							<div class="bg-base-200 rounded-lg p-4">
								<p class="text-sm font-medium mb-2">Transfer ke Virtual Account Permata:</p>
								<div class="flex justify-between items-center">
									<span class="text-sm text-base-content/60">PERMATA</span>
									<div class="flex items-center gap-2">
										<span class="font-mono font-bold text-lg">{status.permata_va_number}</span>
										<button class="btn btn-xs btn-ghost" onclick={() => navigator.clipboard.writeText(status.permata_va_number)}>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						{/if}

						<!-- Mandiri Bill -->
						{#if status.biller_code && status.bill_key}
							<div class="bg-base-200 rounded-lg p-4">
								<p class="text-sm font-medium mb-2">Mandiri Bill Payment:</p>
								<div class="space-y-2">
									<div class="flex justify-between items-center">
										<span class="text-sm text-base-content/60">Biller Code</span>
										<span class="font-mono font-bold">{status.biller_code}</span>
									</div>
									<div class="flex justify-between items-center">
										<span class="text-sm text-base-content/60">Bill Key</span>
										<div class="flex items-center gap-2">
											<span class="font-mono font-bold">{status.bill_key}</span>
											<button class="btn btn-xs btn-ghost" onclick={() => navigator.clipboard.writeText(status.bill_key)}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							</div>
						{/if}

						<!-- Convenience Store -->
						{#if status.payment_code}
							<div class="bg-base-200 rounded-lg p-4">
								<p class="text-sm font-medium mb-2">Kode Pembayaran ({status.store || 'Gerai'}):</p>
								<div class="flex justify-between items-center">
									<span class="text-sm text-base-content/60">{status.store || 'Payment Code'}</span>
									<div class="flex items-center gap-2">
										<span class="font-mono font-bold text-lg">{status.payment_code}</span>
										<button class="btn btn-xs btn-ghost" onclick={() => navigator.clipboard.writeText(status.payment_code)}>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						{/if}

						<button class="btn btn-outline btn-block btn-sm mt-4" onclick={checkStatus}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Refresh Status
						</button>
					{/if}

					<!-- Success state -->
					{#if status.transaction_status === 'settlement' || status.transaction_status === 'capture'}
						<div class="mt-4 p-4 bg-success/10 rounded-lg text-center">
							<div class="text-4xl mb-2">✅</div>
							<p class="font-bold text-success">Pembayaran Berhasil!</p>
							<p class="text-sm text-base-content/60 mt-1">Terima kasih atas pembelian Anda.</p>
						</div>
					{/if}

					<!-- Expired/Cancelled state -->
					{#if status.transaction_status === 'expire' || status.transaction_status === 'cancel' || status.transaction_status === 'deny'}
						<div class="mt-4 p-4 bg-error/10 rounded-lg text-center">
							<div class="text-4xl mb-2">❌</div>
							<p class="font-bold text-error">
								{status.transaction_status === 'expire' ? 'Pembayaran Kedaluwarsa' : 'Pembayaran Dibatalkan'}
							</p>
							<p class="text-sm text-base-content/60 mt-1">Silakan lakukan pemesanan ulang.</p>
						</div>
					{/if}
				{/if}
			</div>
		</div>

		<p class="text-center text-xs text-base-content/40 mt-6">
			Order ID bisa ditemukan di halaman pembayaran atau email konfirmasi.
		</p>
	</div>
</div>
