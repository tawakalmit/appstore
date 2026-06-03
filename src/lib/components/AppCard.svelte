<script lang="ts">
	import type { App } from '$lib/types';

	let { app }: { app: App } = $props();

	function formatPrice(price: number): string {
		if (price === 0) return 'Gratis';
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
	}
</script>

<a href="/apps/{app.slug}" class="card bg-base-100 shadow-sm hover:shadow-lg transition-all border border-base-200 hover:-translate-y-1">
	<div class="card-body p-5">
		<div class="flex items-start gap-4">
			{#if app.icon_url}
				<img src={app.icon_url} alt={app.name} class="w-16 h-16 rounded-xl object-cover" />
			{:else}
				<div class="w-16 h-16 rounded-xl bg-base-200 flex items-center justify-center text-2xl">📱</div>
			{/if}
			<div class="flex-1 min-w-0">
				<h3 class="card-title text-base truncate">{app.name}</h3>
				<p class="text-sm text-base-content/60">{app.developer}</p>
				<div class="flex items-center gap-2 mt-1">
					<span class="badge badge-sm" class:badge-primary={app.type === 'apk'} class:badge-secondary={app.type === 'webapp'}>
						{app.type === 'apk' ? 'APK' : 'Web App'}
					</span>
					<span class="badge badge-sm badge-ghost">{app.category}</span>
				</div>
			</div>
		</div>
		<p class="text-sm text-base-content/70 mt-3 line-clamp-2">{app.short_description}</p>
		<div class="flex items-center justify-end mt-4 pt-3 border-t border-base-200">
			<span class="font-bold text-primary">{formatPrice(app.price)}</span>
		</div>
	</div>
</a>
