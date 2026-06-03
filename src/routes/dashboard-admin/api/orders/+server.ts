import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const GET: RequestHandler = async () => {
	try {
		const { data, error } = await supabase
			.from('orders')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return json(data || []);
	} catch (e) {
		return json({ message: 'Gagal memuat pesanan' }, { status: 500 });
	}
};
