import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: products } = await supabase
		.from('products')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(6);

	const { data: categories } = await supabase
		.from('categories')
		.select('*')
		.order('name');

	const { data: banners } = await supabase
		.from('banners')
		.select('*')
		.eq('active', true)
		.order('sort_order');

	return {
		featuredApps: products || [],
		categories: categories || [],
		banners: banners || []
	};
};
