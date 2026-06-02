import { json } from '@sveltejs/kit';
import { getCategories, createCategory, updateCategory, deleteCategory } from '$lib/server/store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(getCategories());
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const category = {
		id: crypto.randomUUID(),
		name: data.name || '',
		slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || '',
		icon: data.icon || '📦'
	};

	const created = createCategory(category);
	return json(created, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { id, ...rest } = data;

	if (!id) {
		return json({ message: 'ID diperlukan' }, { status: 400 });
	}

	const updated = updateCategory(id, rest);
	if (!updated) {
		return json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
	}

	return json(updated);
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	if (!id) {
		return json({ message: 'ID diperlukan' }, { status: 400 });
	}

	const deleted = deleteCategory(id);
	if (!deleted) {
		return json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
	}

	return json({ success: true });
};
