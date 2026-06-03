import { json } from '@sveltejs/kit';
import { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';
import midtransClient from 'midtrans-client';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const notification = await request.json();

		const core = new midtransClient.CoreApi({
			isProduction: MIDTRANS_IS_PRODUCTION === 'true',
			serverKey: MIDTRANS_SERVER_KEY
		});

		// Verify notification with Midtrans
		const statusResponse = await core.transaction.notification(notification);

		const orderId = statusResponse.order_id;
		const transactionStatus = statusResponse.transaction_status;
		const paymentType = statusResponse.payment_type;
		const fraudStatus = statusResponse.fraud_status;

		let status = transactionStatus;

		// Determine final status
		if (transactionStatus === 'capture') {
			status = fraudStatus === 'accept' ? 'settlement' : 'deny';
		}

		// Update order in database
		await supabase
			.from('orders')
			.update({
				transaction_status: status,
				payment_type: paymentType,
				updated_at: new Date().toISOString()
			})
			.eq('order_id', orderId);

		return json({ status: 'ok' });
	} catch (e: any) {
		console.error('Midtrans notification error:', e);
		return json({ message: 'Error processing notification' }, { status: 500 });
	}
};
