<script lang="ts">
	import { onMount } from 'svelte';
	import type { Order } from '$lib/types';

	let orders = $state<Order[]>([]);
	let loading = $state(true);
	let filter = $state('all');

	onMount(() => {
		loadOrders();
	});

	async function loadOrders() {
		loading = true;
		const res = await fetch('/dashboard-admin/api/orders');
		if (res.ok) {
			orders = await res.json();
		}
		loading = false;
	}

	let filteredOrders = $derived.by(() => {
		if (filter === 'all') return orders;
		return orders.filter(o => o.transaction_status === filter);
	});

	function getStatusBadge(status: string) {
		switch (status) {
			case 'settlement':
			case 'capture':
				return { class: 'badge-success', text: 'Lunas' };
			case 'pending':
				return { class: 'badge-warning', text: 'Pending' };
			case 'expire':
				return { class: 'badge-error', text: 'Expired' };
			case 'cancel':
			case 'deny':
				return { class: 'badge-error', text: 'Batal' };
			default:
				return { class: 'badge-ghost', text: status };
		}
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
	}
</script>

<div>
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold">Pesanan</h1>
		<button class="btn btn-ghost btn-sm" onclick={loadOrders}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			</svg>
			Refresh
		</button>
	</div>

	<!-- Filter -->
	<div class="flex gap-2 mb-4 flex-wrap">
		<button class="btn btn-xs" class:btn-primary={filter === 'all'} onclick={() => filter = 'all'}>Semua</button>
		<button class="btn btn-xs" class:btn-warning={filter === 'pending'} onclick={() => filter = 'pending'}>Pending</button>
		<button class="btn btn-xs" class:btn-success={filter === 'settlement'} onclick={() => filter = 'settlement'}>Lunas</button>
		<button class="btn btn-xs" class:btn-error={filter === 'expire'} onclick={() => filter = 'expire'}>Expired</button>
	</div>

	{#if loading}
		<div class="flex justify-center py-12">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if filteredOrders.length === 0}
		<div class="text-center py-12">
			<div class="text-5xl mb-4">📋</div>
			<p class="text-base-content/60">Belum ada pesanan.</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-zebra bg-base-100 rounded-box shadow text-sm">
				<thead>
					<tr>
						<th>Order ID</th>
						<th>Produk</th>
						<th>Customer</th>
						<th>Kontak</th>
						<th>Total</th>
						<th>Status</th>
						<th>Tanggal</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredOrders as order}
						<tr>
							<td class="font-mono text-xs">{order.order_id}</td>
							<td class="font-medium">{order.product_name}</td>
							<td>{order.customer_name}</td>
							<td>
								<div class="flex flex-col">
									<a href="mailto:{order.customer_email}" class="link link-primary text-xs">{order.customer_email}</a>
									<a href="https://wa.me/{order.customer_phone.replace(/^0/, '62')}" target="_blank" rel="noopener noreferrer" class="link text-xs">{order.customer_phone}</a>
								</div>
							</td>
							<td class="font-medium">{formatPrice(order.amount)}</td>
							<td>
								<span class="badge badge-sm {getStatusBadge(order.transaction_status).class}">
									{getStatusBadge(order.transaction_status).text}
								</span>
							</td>
							<td class="text-xs">{new Date(order.created_at).toLocaleString('id-ID')}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
