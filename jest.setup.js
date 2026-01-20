// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for Request/Response before Next.js loads
if (typeof global.Request === 'undefined') {
  // Use Node.js built-in if available (Node 18+)
  try {
    const { Request, Response, Headers } = require('undici')
    global.Request = Request
    global.Response = Response
    global.Headers = Headers
  } catch (e) {
    // Fallback mock
    global.Request = class MockRequest {
      constructor(url, init = {}) {
        // Store url as private property, expose via getter
        this._url = typeof url === 'string' ? url : url?.url || ''
        this.method = init.method || 'GET'
        this._headers = new Map()
        if (init.headers) {
          Object.entries(init.headers).forEach(([key, value]) => {
            this._headers.set(key.toLowerCase(), value)
          })
        }
        this.body = init.body
      }
      get url() {
        return this._url
      }
      headers = {
        get: (name) => this._headers.get(name?.toLowerCase()),
      }
    }
    global.Response = class MockResponse {
      constructor(body, init = {}) {
        this._body = body
        this.status = init.status || 200
        this.statusText = init.statusText || 'OK'
      }
      json() {
        return Promise.resolve(JSON.parse(this._body || '{}'))
      }
      text() {
        return Promise.resolve(this._body || '')
      }
      static json(data, init = {}) {
        return new MockResponse(JSON.stringify(data), init)
      }
    }
  }
}

// Ensure Response.json exists even if using undici
if (global.Response) {
  const OriginalResponse = global.Response
  // Patch Response.json if it doesn't exist
  if (!OriginalResponse.json) {
    OriginalResponse.json = function(data, init = {}) {
      return new OriginalResponse(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      })
    }
  }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

// Polyfill for TextDecoder/TextEncoder
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('util')
  global.TextDecoder = TextDecoder
  global.TextEncoder = TextEncoder
}

// Polyfill for ReadableStream
if (typeof global.ReadableStream === 'undefined') {
  const { ReadableStream } = require('stream/web')
  global.ReadableStream = ReadableStream
}

// Mock next/server module properly
jest.mock('next/server', () => {
  // Create a proper Response mock with all required properties
  class MockResponseCookies {
    constructor() {
      this._cookies = new Map();
    }
    get(name) {
      return this._cookies.get(name);
    }
    set(name, value, options = {}) {
      this._cookies.set(name, { value, ...options });
    }
    delete(name) {
      this._cookies.delete(name);
    }
    getAll() {
      return Array.from(this._cookies.entries()).map(([name, data]) => ({ name, ...data }));
    }
    getSetCookie() {
      return Array.from(this._cookies.entries()).map(([name, data]) => `${name}=${data.value}`);
    }
  }

  class MockNextResponse extends Response {
    constructor(body, init = {}) {
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body || {});
      const headers = new Headers({
        'Content-Type': 'application/json',
        ...init.headers,
      });
      super(bodyString, { ...init, headers });
      this._cookies = new MockResponseCookies();
    }

    get cookies() {
      return this._cookies;
    }

    static json(data, init = {}) {
      return new MockNextResponse(data, init);
    }
  }

  class MockNextRequest extends Request {
    constructor(input, init = {}) {
      const url = typeof input === 'string' ? input : input?.url || '';
      super(url, init);
      this._url = url;
      this._body = init.body || null;
      this._cookies = new Map();
      if (init.headers && init.headers.Cookie) {
        init.headers.Cookie.split(';').forEach(cookie => {
          const [name, value] = cookie.trim().split('=');
          this._cookies.set(name, { value });
        });
      }
    }

    get url() {
      return this._url || super.url;
    }

    get nextUrl() {
      try {
        const urlObj = new URL(this.url);
        return {
          pathname: urlObj.pathname,
          searchParams: urlObj.searchParams,
        };
      } catch {
        return {
          pathname: '/',
          searchParams: new URLSearchParams(),
        };
      }
    }

    get cookies() {
      return {
        get: (name) => this._cookies.get(name),
        set: (name, value) => this._cookies.set(name, { value }),
        delete: (name) => this._cookies.delete(name),
      };
    }

    async json() {
      if (this._body) {
        try {
          return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
        } catch {
          return {};
        }
      }
      return {};
    }

    async text() {
      return typeof this._body === 'string' ? this._body : '';
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});
