import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { App, Category } from '$lib/types';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// Products
export async function getProducts(): Promise<App[]> {
	const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
	if (error) throw error;
	return data || [];
}

export async function getProduct(id: string): Promise<App | null> {
	const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
	if (error) return null;
	return data;
}

export async function createProduct(product: Omit<App, 'id'>): Promise<App> {
	const { data, error } = await supabase.from('products').insert(product).select().single();
	if (error) throw error;
	return data;
}

export async function updateProduct(id: string, updates: Partial<App>): Promise<App | null> {
	const { data, error } = await supabase
		.from('products')
		.update({ ...updates, updated_at: new Date().toISOString() })
		.eq('id', id)
		.select()
		.single();
	if (error) return null;
	return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
	const { error } = await supabase.from('products').delete().eq('id', id);
	return !error;
}

// Categories
export async function getCategories(): Promise<Category[]> {
	const { data, error } = await supabase.from('categories').select('*').order('name');
	if (error) throw error;
	return data || [];
}

export async function getCategory(id: string): Promise<Category | null> {
	const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
	if (error) return null;
	return data;
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
	const { data, error } = await supabase.from('categories').insert(category).select().single();
	if (error) throw error;
	return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
	const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
	if (error) return null;
	return data;
}

export async function deleteCategory(id: string): Promise<boolean> {
	const { error } = await supabase.from('categories').delete().eq('id', id);
	return !error;
}

// Banners
import type { Banner } from '$lib/types';

export async function getBanners(): Promise<Banner[]> {
	const { data, error } = await supabase.from('banners').select('*').eq('active', true).order('sort_order');
	if (error) throw error;
	return data || [];
}

export async function getAllBanners(): Promise<Banner[]> {
	const { data, error } = await supabase.from('banners').select('*').order('sort_order');
	if (error) throw error;
	return data || [];
}

export async function createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
	const { data, error } = await supabase.from('banners').insert(banner).select().single();
	if (error) throw error;
	return data;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
	const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single();
	if (error) return null;
	return data;
}

export async function deleteBanner(id: string): Promise<boolean> {
	const { error } = await supabase.from('banners').delete().eq('id', id);
	return !error;
}
