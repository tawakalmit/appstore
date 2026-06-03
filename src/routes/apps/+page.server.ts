import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { data: products } = await supabase
		.from('products')
		.select('*')
		.order('created_at', { ascending: false });

	const { data: categories } = await supabase
		.from('categories')
		.select('*')
		.order('name');

	return {
		allApps: products || [],
		categories: categories || []
	};
};
