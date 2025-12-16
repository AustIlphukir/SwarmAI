// Extend Jest's assertions with helpful DOM matchers from
// @testing-library/jest-dom.  This import adds methods like
// toBeInTheDocument() and toHaveClass() that make assertions on
// rendered components more expressive.
import '@testing-library/jest-dom';

// Minimal Request polyfill for Node/Jest environment used by route tests.
// Some server route tests construct `new Request(url, { method, headers, body })`
// and call `req.json()` and `req.headers.get(...)`. jsdom/node may not provide
// a global Request in older environments, so provide a lightweight shim.
if (typeof (global as any).Request === 'undefined') {
	class SimpleRequest {
		url: string;
		method: string;
		headers: { get: (name: string) => string | undefined };
		_body: any;
		constructor(input: any, init: any = {}) {
			this.url = typeof input === 'string' ? input : input?.url;
			this.method = (init?.method || (input && input.method) || 'GET').toUpperCase();
			this._body = init?.body ?? null;
			const raw = init?.headers || (input && input.headers) || {};
			this.headers = {
				get: (name: string) => {
					if (!raw) return undefined;
					const key = Object.keys(raw).find(k => k.toLowerCase() === name.toLowerCase());
					return key ? raw[key] : undefined;
				},
			};
		}
		async json() {
			if (!this._body) return null;
			try { return JSON.parse(this._body); } catch { return null; }
		}
	}
	(global as any).Request = SimpleRequest as any;
}

// Minimal Response polyfill used by route tests and Next.js server stubs
if (typeof (global as any).Response === 'undefined') {
	class SimpleHeaders {
		map: Map<string,string>;
		constructor(init?: Record<string,string>) { this.map = new Map(); if (init) { Object.entries(init).forEach(([k,v])=>this.map.set(k, String(v))); } }
		set(name: string, value: string) { this.map.set(name, String(value)); }
		get(name: string) { return this.map.get(name) ?? null; }
	}

	class SimpleResponse {
		status: number;
		headers: SimpleHeaders;
		body: any;
		constructor(body: any = null, init: any = {}) {
			this.status = init?.status ?? 200;
			this.headers = new SimpleHeaders(init?.headers ?? {});
			this.body = body;
		}
		async json() {
			if (typeof this.body === 'string') {
				try { return JSON.parse(this.body); } catch { return this.body; }
			}
			return this.body;
		}
		text() { return Promise.resolve(typeof this.body === 'string' ? this.body : JSON.stringify(this.body)); }
	}
	// static helper to mimic the browser Response.json() factory used by Next
	(SimpleResponse as any).json = function (body: any, init?: any) {
		return new SimpleResponse(body, init);
	};
	(global as any).Response = SimpleResponse as any;
}

	// Stub window.location.reload in the Jest/jsdom environment to avoid
	// "Not implemented: navigation" console errors when components call
	// `window.location.reload()` in tests. Individual tests can override this
	// stub if they need to assert navigation behavior.
	if (typeof (global as any).location === 'undefined') {
		(global as any).location = { reload: () => {} };
	} else if (typeof (global as any).location.reload === 'undefined') {
		(global as any).location.reload = () => {};
	}

	// Provide a default global.fetch no-op mock to make tests explicit about
	// network behavior. Tests should set `global.fetch = jest.fn(...)` when
	// they expect calls; leaving a default prevents accidental real network
	// requests in some environments.
	if (typeof (global as any).fetch === 'undefined') {
		(global as any).fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }) as any;
	}