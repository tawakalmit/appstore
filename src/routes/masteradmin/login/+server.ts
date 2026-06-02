import { json } from '@sveltejs/kit';
import { ADMIN_USER, ADMIN_PASSWORD } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
		cookies.set('admin_session', 'authenticated', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
			maxAge: 60 * 60 * 24 // 1 day
		});

		return json({ success: true });
	}

	return json({ message: 'Username atau password salah' }, { status: 401 });
};
