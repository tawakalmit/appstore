import { json } from '@sveltejs/kit';
import { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';
import midtransClient from 'midtrans-client';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, email, phone, product_name, product_id, price } = await request.json();

		if (!name || !email || !phone) {
			return json({ message: 'Nama, email, dan nomor HP wajib diisi' }, { status: 400 });
		}

		const snap = new midtransClient.Snap({
			isProduction: MIDTRANS_IS_PRODUCTION === 'true',
			serverKey: MIDTRANS_SERVER_KEY
		});

		const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

		const parameter = {
			transaction_details: {
				order_id: orderId,
				gross_amount: price
			},
			item_details: [
				{
					id: product_id,
					price: price,
					quantity: 1,
					name: product_name.substring(0, 50)
				}
			],
			customer_details: {
				first_name: name,
				email: email,
				phone: phone
			}
		};

		const transaction = await snap.createTransaction(parameter);

		// Save order to database
		await supabase.from('orders').insert({
			order_id: orderId,
			product_id: product_id,
			product_name: product_name,
			customer_name: name,
			customer_email: email,
			customer_phone: phone,
			amount: price,
			payment_type: '',
			transaction_status: 'pending'
		});

		return json({
			token: transaction.token,
			redirect_url: transaction.redirect_url,
			order_id: orderId
		});
	} catch (e: any) {
		console.error('Midtrans error:', e);
		return json({ message: e.message || 'Gagal membuat transaksi' }, { status: 500 });
	}
};
