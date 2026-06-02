export interface App {
	id: string;
	name: string;
	slug: string;
	description: string;
	short_description: string;
	type: 'apk' | 'webapp';
	price: number;
	icon_url: string;
	screenshots: string[];
	category: string;
	developer: string;
	version: string;
	download_url: string;
	demo_url?: string;
	rating: number;
	total_downloads: number;
	created_at: string;
	updated_at: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	icon: string;
}
