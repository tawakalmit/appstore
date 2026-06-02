<script lang="ts">
	import type { App } from '$lib/types';

	let { app }: { app: App } = $props();

	function formatPrice(price: number): string {
		if (price === 0) return 'Gratis';
		return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
	}

	function formatDownloads(count: number): string {
		if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
		return count.toString();
	}
</script>

<a href="/apps/{app.slug}" class="card bg-base-100 shadow-sm hover:shadow-lg transition-all border border-base-200 hover:-translate-y-1">
	<div class="card-body p-5">
		<div class="flex items-start gap-4">
			<img src={app.icon_url} alt={app.name} class="w-16 h-16 rounded-xl object-cover" />
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
		<div class="flex items-center justify-between mt-4 pt-3 border-t border-base-200">
			<div class="flex items-center gap-3 text-sm">
				<span class="flex items-center gap-1 text-warning">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 24 24">
						<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
					</svg>
					{app.rating}
				</span>
				<span class="text-base-content/50">{formatDownloads(app.total_downloads)} downloads</span>
			</div>
			<span class="font-bold text-primary">{formatPrice(app.price)}</span>
		</div>
	</div>
</a>
