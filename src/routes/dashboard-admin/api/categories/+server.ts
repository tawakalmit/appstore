import { json } from '@sveltejs/kit';
import { getCategories, createCategory, updateCategory, deleteCategory } from '$lib/server/store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const categories = await getCategories();
		return json(categories);
	} catch (e) {
		return json({ message: 'Gagal memuat kategori' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const category = {
			name: data.name || '',
			slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
			icon: data.icon || '📦'
		};

		const created = await createCategory(category);
		return json(created, { status: 201 });
	} catch (e) {
		return json({ message: 'Gagal menambah kategori' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const { id, ...rest } = data;

		if (!id) {
			return json({ message: 'ID diperlukan' }, { status: 400 });
		}

		const updated = await updateCategory(id, rest);
		if (!updated) {
			return json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
		}

		return json(updated);
	} catch (e) {
		return json({ message: 'Gagal mengupdate kategori' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();

		if (!id) {
			return json({ message: 'ID diperlukan' }, { status: 400 });
		}

		const deleted = await deleteCategory(id);
		if (!deleted) {
			return json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
		}

		return json({ success: true });
	} catch (e) {
		return json({ message: 'Gagal menghapus kategori' }, { status: 500 });
	}
};
