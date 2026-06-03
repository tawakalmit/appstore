import { json } from '@sveltejs/kit';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '$lib/server/store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const banners = await getAllBanners();
		return json(banners);
	} catch (e) {
		return json({ message: 'Gagal memuat banner' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const banner = {
			headline: data.headline || '',
			description: data.description || '',
			btn_text: data.btn_text || '',
			btn_link: data.btn_link || '',
			desktop_image: data.desktop_image || '',
			mobile_image: data.mobile_image || '',
			icon_url: data.icon_url || '',
			icon_text: data.icon_text || '',
			text_color: data.text_color || 'dark',
			sort_order: Number(data.sort_order) || 0,
			active: data.active !== false
		};

		const created = await createBanner(banner);
		return json(created, { status: 201 });
	} catch (e) {
		return json({ message: 'Gagal menambah banner' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const { id, ...rest } = data;

		if (!id) {
			return json({ message: 'ID diperlukan' }, { status: 400 });
		}

		const updated = await updateBanner(id, rest);
		if (!updated) {
			return json({ message: 'Banner tidak ditemukan' }, { status: 404 });
		}

		return json(updated);
	} catch (e) {
		return json({ message: 'Gagal mengupdate banner' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();

		if (!id) {
			return json({ message: 'ID diperlukan' }, { status: 400 });
		}

		const deleted = await deleteBanner(id);
		if (!deleted) {
			return json({ message: 'Banner tidak ditemukan' }, { status: 404 });
		}

		return json({ success: true });
	} catch (e) {
		return json({ message: 'Gagal menghapus banner' }, { status: 500 });
	}
};
