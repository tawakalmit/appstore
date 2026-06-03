import { json } from '@sveltejs/kit';
import { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION } from '$env/static/private';
import type { RequestHandler } from './$types';
import midtransClient from 'midtrans-client';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { order_id } = await request.json();

		if (!order_id) {
			return json({ message: 'Order ID diperlukan' }, { status: 400 });
		}

		const core = new midtransClient.CoreApi({
			isProduction: MIDTRANS_IS_PRODUCTION === 'true',
			serverKey: MIDTRANS_SERVER_KEY
		});

		const status = await core.transaction.status(order_id);

		return json({
			order_id: status.order_id,
			transaction_status: status.transaction_status,
			payment_type: status.payment_type,
			gross_amount: status.gross_amount,
			transaction_time: status.transaction_time,
			expiry_time: status.expiry_time || null,
			fraud_status: status.fraud_status,
			// VA / Bank Transfer details
			va_numbers: status.va_numbers || null,
			permata_va_number: status.permata_va_number || null,
			bill_key: status.bill_key || null,
			biller_code: status.biller_code || null,
			// QRIS / GoPay / e-wallet
			actions: status.actions || null,
			// Store (Indomaret/Alfamart)
			payment_code: status.payment_code || null,
			store: status.store || null
		});
	} catch (e: any) {
		console.error('Midtrans status check error:', e);
		return json({ message: e.message || 'Gagal mengecek status' }, { status: 500 });
	}
};
