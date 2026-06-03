import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const folder = formData.get('folder') as string || 'uploads';

		if (!file) {
			return json({ message: 'File tidak ditemukan' }, { status: 400 });
		}

		const ext = file.name.split('.').pop();
		const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

		const { data, error } = await supabase.storage
			.from('products')
			.upload(fileName, file, {
				contentType: file.type,
				upsert: false
			});

		if (error) {
			console.error('Supabase storage upload error:', error.message);
			return json({ message: error.message }, { status: 500 });
		}

		const { data: urlData } = supabase.storage
			.from('products')
			.getPublicUrl(data.path);

		return json({ url: urlData.publicUrl });
	} catch (e) {
		return json({ message: 'Gagal upload file' }, { status: 500 });
	}
};
