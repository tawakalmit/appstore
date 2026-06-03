import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data: app } = await supabase
		.from('products')
		.select('*')
		.eq('slug', params.slug)
		.single();

	if (!app) {
		throw error(404, 'Aplikasi tidak ditemukan');
	}

	return { app };
};
