import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import type { App, Category } from '$lib/types';

const DATA_DIR = resolve('data');
const PRODUCTS_FILE = resolve(DATA_DIR, 'products.json');
const CATEGORIES_FILE = resolve(DATA_DIR, 'categories.json');

function readJSON<T>(filePath: string): T[] {
	if (!existsSync(filePath)) {
		return [];
	}
	try {
		const raw = readFileSync(filePath, 'utf-8');
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

function writeJSON<T>(filePath: string, data: T[]) {
	const dir = dirname(filePath);
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Products
export function getProducts(): App[] {
	return readJSON<App>(PRODUCTS_FILE);
}

export function getProduct(id: string): App | undefined {
	return getProducts().find((p) => p.id === id);
}

export function createProduct(product: App): App {
	const products = getProducts();
	products.push(product);
	writeJSON(PRODUCTS_FILE, products);
	return product;
}

export function updateProduct(id: string, data: Partial<App>): App | null {
	const products = getProducts();
	const index = products.findIndex((p) => p.id === id);
	if (index === -1) return null;
	products[index] = { ...products[index], ...data, updated_at: new Date().toISOString() };
	writeJSON(PRODUCTS_FILE, products);
	return products[index];
}

export function deleteProduct(id: string): boolean {
	const products = getProducts();
	const filtered = products.filter((p) => p.id !== id);
	if (filtered.length === products.length) return false;
	writeJSON(PRODUCTS_FILE, filtered);
	return true;
}

// Categories
export function getCategories(): Category[] {
	return readJSON<Category>(CATEGORIES_FILE);
}

export function getCategory(id: string): Category | undefined {
	return getCategories().find((c) => c.id === id);
}

export function createCategory(category: Category): Category {
	const categories = getCategories();
	categories.push(category);
	writeJSON(CATEGORIES_FILE, categories);
	return category;
}

export function updateCategory(id: string, data: Partial<Category>): Category | null {
	const categories = getCategories();
	const index = categories.findIndex((c) => c.id === id);
	if (index === -1) return null;
	categories[index] = { ...categories[index], ...data };
	writeJSON(CATEGORIES_FILE, categories);
	return categories[index];
}

export function deleteCategory(id: string): boolean {
	const categories = getCategories();
	const filtered = categories.filter((c) => c.id !== id);
	if (filtered.length === categories.length) return false;
	writeJSON(CATEGORIES_FILE, filtered);
	return true;
}
