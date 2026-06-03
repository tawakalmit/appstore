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

export interface Banner {
	id: string;
	headline: string;
	description: string;
	btn_text: string;
	btn_link: string;
	desktop_image: string;
	mobile_image: string;
	icon_url: string;
	icon_text: string;
	text_color: 'dark' | 'light';
	sort_order: number;
	active: boolean;
}
