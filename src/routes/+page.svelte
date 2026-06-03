<script lang="ts">
	import type { App, Category, Banner } from '$lib/types';
	import AppCard from '$lib/components/AppCard.svelte';
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/effect-fade';

	let { data } = $props();

	const featuredApps: App[] = data.featuredApps;
	const categories: Category[] = data.categories;
	const banners: Banner[] = data.banners;

	onMount(() => {
		if (banners.length > 0) {
			new Swiper('.hero-swiper', {
				modules: [Autoplay, Pagination, EffectFade],
				effect: 'fade',
				loop: banners.length > 1,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				}
			});
		}
	});
</script>

<svelte:head>
	<title>TokoApps - Marketplace Aplikasi APK & Web Apps</title>
</svelte:head>

<!-- Hero Banner Slider -->
{#if banners.length > 0}
<section class="hero-swiper swiper w-full h-dvh -mt-16">
	<div class="swiper-wrapper">
		{#each banners as slide}
			<div class="swiper-slide relative">
				<!-- Desktop Background -->
				<img
					src={slide.desktop_image}
					alt=""
					class="absolute inset-0 w-full h-full object-cover hidden lg:block"
				/>
				<!-- Mobile Background -->
				<img
					src={slide.mobile_image || slide.desktop_image}
					alt=""
					class="absolute inset-0 w-full h-full object-cover lg:hidden"
				/>
				<!-- Content - Left Side -->
				<div class="relative z-10 flex items-start lg:items-center h-full pt-[120px] lg:pt-0">
					<div class="px-8 md:px-16 lg:px-24 max-w-2xl">
						{#if slide.icon_url || slide.icon_text}
							<div class="flex items-center gap-3 mb-8">
								{#if slide.icon_url}
									<img src={slide.icon_url} alt="" class="h-10 md:h-12 object-contain" />
								{/if}
								{#if slide.icon_text}
									<span class="text-2xl md:text-3xl font-bold {slide.text_color === 'light' ? 'text-white' : 'text-gray-900'}">{slide.icon_text}</span>
								{/if}
							</div>
						{/if}
						<h1 class="banner-headline text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] mb-6 {slide.text_color === 'light' ? 'text-white' : 'text-gray-900'}">{slide.headline}</h1>
						<p class="text-sm md:text-base mb-8 max-w-sm leading-relaxed {slide.text_color === 'light' ? 'text-white/80' : 'text-gray-600'}">{slide.description}</p>
						{#if slide.btn_text && slide.btn_link}
							<a
								href={slide.btn_link}
								target={slide.btn_link.startsWith('http') ? '_blank' : undefined}
								rel={slide.btn_link.startsWith('http') ? 'noopener noreferrer' : undefined}
								class="btn rounded-full bg-amber-400 hover:bg-amber-500 border-none text-gray-900 font-bold px-8"
							>
								{slide.btn_text} →
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="swiper-pagination"></div>
</section>
{/if}

<!-- Categories -->
<!-- <section class="py-8 container mx-auto px-4">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-2xl font-bold">Kategori</h2>
		<a href="/categories" class="btn btn-ghost btn-sm">Lihat Semua →</a>
	</div>
	{#if categories.length > 0}
		<div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
			{#each categories as category}
				<a href="/apps?category={category.name}" class="badge badge-lg badge-outline whitespace-nowrap hover:badge-primary transition-colors cursor-pointer shrink-0">
					{category.name}
				</a>
			{/each}
		</div>
	{:else}
		<p class="text-center text-base-content/50">Belum ada kategori</p>
	{/if}
</section> -->

<!-- Featured Apps -->
<section class="py-12 bg-base-200">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center mb-5">
			<h2 class="text-2xl font-bold">Aplikasi Unggulan</h2>
			<a href="/apps" class="btn btn-ghost btn-sm">Lihat Semua →</a>
		</div>

		{#if categories.length > 0}
			<div class="flex gap-3 overflow-x-auto pt-4 pb-7 scrollbar-hide">
				{#each categories as category}
					<a href="/apps?category={category.name}" class="badge badge-lg badge-outline whitespace-nowrap hover:badge-primary transition-colors cursor-pointer shrink-0">
						{category.name}
					</a>
				{/each}
			</div>
		{:else}
			<p class="text-center text-base-content/50">Belum ada kategori</p>
		{/if}

		{#if featuredApps.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each featuredApps as app}
					<AppCard {app} />
				{/each}
			</div>
		{:else}
			<p class="text-center text-base-content/50 py-8">Belum ada aplikasi tersedia</p>
		{/if}
	</div>
</section>

<!-- CTA -->
<section class="py-16 container mx-auto px-4">
	<div class="card bg-primary text-primary-content">
		<div class="card-body text-center py-12">
			<h2 class="text-3xl font-bold">Butuh Aplikasi Custom untuk Bisnis Anda?</h2>
			<p class="text-primary-content/80 max-w-md mx-auto">
				Kami siap membantu membuatkan aplikasi sesuai kebutuhan bisnis Anda. Konsultasikan ide Anda sekarang.
			</p>
			<div class="card-actions justify-center mt-4">
				<a href="https://wa.me/6285156837220" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
					</svg>
					Hubungi via WhatsApp
				</a>
			</div>
		</div>
	</div>
</section>
