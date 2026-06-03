import { json } from '@sveltejs/kit';
import { getProducts, createProduct, updateProduct, deleteProduct } from '$lib/server/store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const products = await getProducts();
		return json(products);
	} catch (e) {
		return json({ message: 'Gagal memuat produk' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const now = new Date().toISOString();
		const product = {
			name: data.name || '',
			slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
			description: data.description || '',
			short_description: data.short_description || '',
			type: data.type || 'apk',
			price: Number(data.price) || 0,
			icon_url: data.icon_url || '',
			screenshots: data.screenshots || [],
			category: data.category || '',
			developer: data.developer || '',
			version: data.version || '1.0.0',
			download_url: data.download_url || '',
			demo_url: data.demo_url || '',
			rating: 0,
			total_downloads: 0,
			created_at: now,
			updated_at: now
		};

		const created = await createProduct(product);
		return json(created, { status: 201 });
	} catch (e) {
		return json({ message: 'Gagal menambah produk' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const { id, ...rest } = data;

		if (!id) {
			return json({ message: 'ID diperlukan' }, { status: 400 });
		}

		const updated = await updateProduct(id, rest);
		if (!updated) {
			return json({ message: 'Produk tidak ditemukan' }, { status: 404 });
		}

		return json(updated);
	} catch (e) {
		return json({ message: 'Gagal mengupdate produk' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();

		if (!id) {
			return json({ message: 'ID diperlukan' }, { status: 400 });
		}

		const deleted = await deleteProduct(id);
		if (!deleted) {
			return json({ message: 'Produk tidak ditemukan' }, { status: 404 });
		}

		return json({ success: true });
	} catch (e) {
		return json({ message: 'Gagal menghapus produk' }, { status: 500 });
	}
};
