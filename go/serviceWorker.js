try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const E = (n, ...e) => {
  let t = n;
  return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t;
}, N = E;
class h extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, t) {
    const s = N(e, t);
    super(s), this.name = e, this.details = t;
  }
}
const f = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, C = (n) => [f.prefix, n, f.suffix].filter((e) => e && e.length > 0).join("-"), v = (n) => {
  for (const e of Object.keys(f))
    n(e);
}, k = {
  updateDetails: (n) => {
    v((e) => {
      typeof n[e] == "string" && (f[e] = n[e]);
    });
  },
  getGoogleAnalyticsName: (n) => n || C(f.googleAnalytics),
  getPrecacheName: (n) => n || C(f.precache),
  getPrefix: () => f.prefix,
  getRuntimeName: (n) => n || C(f.runtime),
  getSuffix: () => f.suffix
};
function P(n, e) {
  const t = e();
  return n.waitUntil(t), t;
}
try {
  self["workbox:precaching:7.0.0"] && _();
} catch {
}
const W = "__WB_REVISION__";
function M(n) {
  if (!n)
    throw new h("add-to-cache-list-unexpected-type", { entry: n });
  if (typeof n == "string") {
    const r = new URL(n, location.href);
    return {
      cacheKey: r.href,
      url: r.href
    };
  }
  const { revision: e, url: t } = n;
  if (!t)
    throw new h("add-to-cache-list-unexpected-type", { entry: n });
  if (!e) {
    const r = new URL(t, location.href);
    return {
      cacheKey: r.href,
      url: r.href
    };
  }
  const s = new URL(t, location.href), a = new URL(t, location.href);
  return s.searchParams.set(W, e), {
    cacheKey: s.href,
    url: a.href
  };
}
class q {
  constructor() {
    this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    }, this.cachedResponseWillBeUsed = async ({ event: e, state: t, cachedResponse: s }) => {
      if (e.type === "install" && t && t.originalRequest && t.originalRequest instanceof Request) {
        const a = t.originalRequest.url;
        s ? this.notUpdatedURLs.push(a) : this.updatedURLs.push(a);
      }
      return s;
    };
  }
}
class O {
  constructor({ precacheController: e }) {
    this.cacheKeyWillBeUsed = async ({ request: t, params: s }) => {
      const a = (s == null ? void 0 : s.cacheKey) || this._precacheController.getCacheKeyForURL(t.url);
      return a ? new Request(a, { headers: t.headers }) : t;
    }, this._precacheController = e;
  }
}
let p;
function S() {
  if (p === void 0) {
    const n = new Response("");
    if ("body" in n)
      try {
        new Response(n.body), p = !0;
      } catch {
        p = !1;
      }
    p = !1;
  }
  return p;
}
async function D(n, e) {
  let t = null;
  if (n.url && (t = new URL(n.url).origin), t !== self.location.origin)
    throw new h("cross-origin-copy-response", { origin: t });
  const s = n.clone(), a = {
    headers: new Headers(s.headers),
    status: s.status,
    statusText: s.statusText
  }, r = e ? e(a) : a, c = S() ? s.body : await s.blob();
  return new Response(c, r);
}
const A = (n) => new URL(String(n), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function K(n, e) {
  const t = new URL(n);
  for (const s of e)
    t.searchParams.delete(s);
  return t.href;
}
async function F(n, e, t, s) {
  const a = K(e.url, t);
  if (e.url === a)
    return n.match(e, s);
  const r = Object.assign(Object.assign({}, s), { ignoreSearch: !0 }), c = await n.keys(e, r);
  for (const i of c) {
    const o = K(i.url, t);
    if (a === o)
      return n.match(i, s);
  }
}
class H {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
const j = /* @__PURE__ */ new Set();
async function B() {
  for (const n of j)
    await n();
}
function $(n) {
  return new Promise((e) => setTimeout(e, n));
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function m(n) {
  return typeof n == "string" ? new Request(n) : n;
}
class V {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, t) {
    this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new H(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const s of this._plugins)
      this._pluginStateMap.set(s, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: t } = this;
    let s = m(e);
    if (s.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
      const c = await t.preloadResponse;
      if (c)
        return c;
    }
    const a = this.hasCallback("fetchDidFail") ? s.clone() : null;
    try {
      for (const c of this.iterateCallbacks("requestWillFetch"))
        s = await c({ request: s.clone(), event: t });
    } catch (c) {
      if (c instanceof Error)
        throw new h("plugin-error-request-will-fetch", {
          thrownErrorMessage: c.message
        });
    }
    const r = s.clone();
    try {
      let c;
      c = await fetch(s, s.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const i of this.iterateCallbacks("fetchDidSucceed"))
        c = await i({
          event: t,
          request: r,
          response: c
        });
      return c;
    } catch (c) {
      throw a && await this.runCallbacks("fetchDidFail", {
        error: c,
        event: t,
        originalRequest: a.clone(),
        request: r.clone()
      }), c;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const t = await this.fetch(e), s = t.clone();
    return this.waitUntil(this.cachePut(e, s)), t;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const t = m(e);
    let s;
    const { cacheName: a, matchOptions: r } = this._strategy, c = await this.getCacheKey(t, "read"), i = Object.assign(Object.assign({}, r), { cacheName: a });
    s = await caches.match(c, i);
    for (const o of this.iterateCallbacks("cachedResponseWillBeUsed"))
      s = await o({
        cacheName: a,
        matchOptions: r,
        cachedResponse: s,
        request: c,
        event: this.event
      }) || void 0;
    return s;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, t) {
    const s = m(e);
    await $(0);
    const a = await this.getCacheKey(s, "write");
    if (!t)
      throw new h("cache-put-with-no-response", {
        url: A(a.url)
      });
    const r = await this._ensureResponseSafeToCache(t);
    if (!r)
      return !1;
    const { cacheName: c, matchOptions: i } = this._strategy, o = await self.caches.open(c), l = this.hasCallback("cacheDidUpdate"), g = l ? await F(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      o,
      a.clone(),
      ["__WB_REVISION__"],
      i
    ) : null;
    try {
      await o.put(a, l ? r.clone() : r);
    } catch (u) {
      if (u instanceof Error)
        throw u.name === "QuotaExceededError" && await B(), u;
    }
    for (const u of this.iterateCallbacks("cacheDidUpdate"))
      await u({
        cacheName: c,
        oldResponse: g,
        newResponse: r.clone(),
        request: a,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, t) {
    const s = `${e.url} | ${t}`;
    if (!this._cacheKeys[s]) {
      let a = e;
      for (const r of this.iterateCallbacks("cacheKeyWillBeUsed"))
        a = m(await r({
          mode: t,
          request: a,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[s] = a;
    }
    return this._cacheKeys[s];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const t of this._strategy.plugins)
      if (e in t)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, t) {
    for (const s of this.iterateCallbacks(e))
      await s(t);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const t of this._strategy.plugins)
      if (typeof t[e] == "function") {
        const s = this._pluginStateMap.get(t);
        yield (r) => {
          const c = Object.assign(Object.assign({}, r), { state: s });
          return t[e](c);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let t = e, s = !1;
    for (const a of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await a({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0, s = !0, !t)
        break;
    return s || t && t.status !== 200 && (t = void 0), t;
  }
}
class G {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = k.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [t] = this.handleAll(e);
    return t;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event, s = typeof e.request == "string" ? new Request(e.request) : e.request, a = "params" in e ? e.params : void 0, r = new V(this, { event: t, request: s, params: a }), c = this._getResponse(r, s, t), i = this._awaitComplete(c, r, s, t);
    return [c, i];
  }
  async _getResponse(e, t, s) {
    await e.runCallbacks("handlerWillStart", { event: s, request: t });
    let a;
    try {
      if (a = await this._handle(t, e), !a || a.type === "error")
        throw new h("no-response", { url: t.url });
    } catch (r) {
      if (r instanceof Error) {
        for (const c of e.iterateCallbacks("handlerDidError"))
          if (a = await c({ error: r, event: s, request: t }), a)
            break;
      }
      if (!a)
        throw r;
    }
    for (const r of e.iterateCallbacks("handlerWillRespond"))
      a = await r({ event: s, request: t, response: a });
    return a;
  }
  async _awaitComplete(e, t, s, a) {
    let r, c;
    try {
      r = await e;
    } catch {
    }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: a,
        request: s,
        response: r
      }), await t.doneWaiting();
    } catch (i) {
      i instanceof Error && (c = i);
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: a,
      request: s,
      response: r,
      error: c
    }), t.destroy(), c)
      throw c;
  }
}
class d extends G {
  /**
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
   * of all fetch() requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor(e = {}) {
    e.cacheName = k.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(d.copyRedirectedCacheableResponsesPlugin);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const s = await t.cacheMatch(e);
    return s || (t.event && t.event.type === "install" ? await this._handleInstall(e, t) : await this._handleFetch(e, t));
  }
  async _handleFetch(e, t) {
    let s;
    const a = t.params || {};
    if (this._fallbackToNetwork) {
      const r = a.integrity, c = e.integrity, i = !c || c === r;
      s = await t.fetch(new Request(e, {
        integrity: e.mode !== "no-cors" ? c || r : void 0
      })), r && i && e.mode !== "no-cors" && (this._useDefaultCacheabilityPluginIfNeeded(), await t.cachePut(e, s.clone()));
    } else
      throw new h("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    return s;
  }
  async _handleInstall(e, t) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const s = await t.fetch(e);
    if (!await t.cachePut(e, s.clone()))
      throw new h("bad-precaching-response", {
        url: e.url,
        status: s.status
      });
    return s;
  }
  /**
   * This method is complex, as there a number of things to account for:
   *
   * The `plugins` array can be set at construction, and/or it might be added to
   * to at any time before the strategy is used.
   *
   * At the time the strategy is used (i.e. during an `install` event), there
   * needs to be at least one plugin that implements `cacheWillUpdate` in the
   * array, other than `copyRedirectedCacheableResponsesPlugin`.
   *
   * - If this method is called and there are no suitable `cacheWillUpdate`
   * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
   *
   * - If this method is called and there is exactly one `cacheWillUpdate`, then
   * we don't have to do anything (this might be a previously added
   * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
   *
   * - If this method is called and there is more than one `cacheWillUpdate`,
   * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
   * we need to remove it. (This situation is unlikely, but it could happen if
   * the strategy is used multiple times, the first without a `cacheWillUpdate`,
   * and then later on after manually adding a custom `cacheWillUpdate`.)
   *
   * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
   *
   * @private
   */
  _useDefaultCacheabilityPluginIfNeeded() {
    let e = null, t = 0;
    for (const [s, a] of this.plugins.entries())
      a !== d.copyRedirectedCacheableResponsesPlugin && (a === d.defaultPrecacheCacheabilityPlugin && (e = s), a.cacheWillUpdate && t++);
    t === 0 ? this.plugins.push(d.defaultPrecacheCacheabilityPlugin) : t > 1 && e !== null && this.plugins.splice(e, 1);
  }
}
d.defaultPrecacheCacheabilityPlugin = {
  async cacheWillUpdate({ response: n }) {
    return !n || n.status >= 400 ? null : n;
  }
};
d.copyRedirectedCacheableResponsesPlugin = {
  async cacheWillUpdate({ response: n }) {
    return n.redirected ? await D(n) : n;
  }
};
class Q {
  /**
   * Create a new PrecacheController.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] The cache to use for precaching.
   * @param {string} [options.plugins] Plugins to use when precaching as well
   * as responding to fetch events for precached assets.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor({ cacheName: e, plugins: t = [], fallbackToNetwork: s = !0 } = {}) {
    this._urlsToCacheKeys = /* @__PURE__ */ new Map(), this._urlsToCacheModes = /* @__PURE__ */ new Map(), this._cacheKeysToIntegrities = /* @__PURE__ */ new Map(), this._strategy = new d({
      cacheName: k.getPrecacheName(e),
      plugins: [
        ...t,
        new O({ precacheController: this })
      ],
      fallbackToNetwork: s
    }), this.install = this.install.bind(this), this.activate = this.activate.bind(this);
  }
  /**
   * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
   * used to cache assets and respond to fetch events.
   */
  get strategy() {
    return this._strategy;
  }
  /**
   * Adds items to the precache list, removing any duplicates and
   * stores the files in the
   * {@link workbox-core.cacheNames|"precache cache"} when the service
   * worker installs.
   *
   * This method can be called multiple times.
   *
   * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
   */
  precache(e) {
    this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0);
  }
  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
   *     Array of entries to precache.
   */
  addToCacheList(e) {
    const t = [];
    for (const s of e) {
      typeof s == "string" ? t.push(s) : s && s.revision === void 0 && t.push(s.url);
      const { cacheKey: a, url: r } = M(s), c = typeof s != "string" && s.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(r) && this._urlsToCacheKeys.get(r) !== a)
        throw new h("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(r),
          secondEntry: a
        });
      if (typeof s != "string" && s.integrity) {
        if (this._cacheKeysToIntegrities.has(a) && this._cacheKeysToIntegrities.get(a) !== s.integrity)
          throw new h("add-to-cache-list-conflicting-integrities", {
            url: r
          });
        this._cacheKeysToIntegrities.set(a, s.integrity);
      }
      if (this._urlsToCacheKeys.set(r, a), this._urlsToCacheModes.set(r, c), t.length > 0) {
        const i = `Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(i);
      }
    }
  }
  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.InstallResult>}
   */
  install(e) {
    return P(e, async () => {
      const t = new q();
      this.strategy.plugins.push(t);
      for (const [r, c] of this._urlsToCacheKeys) {
        const i = this._cacheKeysToIntegrities.get(c), o = this._urlsToCacheModes.get(r), l = new Request(r, {
          integrity: i,
          cache: o,
          credentials: "same-origin"
        });
        await Promise.all(this.strategy.handleAll({
          params: { cacheKey: c },
          request: l,
          event: e
        }));
      }
      const { updatedURLs: s, notUpdatedURLs: a } = t;
      return { updatedURLs: s, notUpdatedURLs: a };
    });
  }
  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param {ExtendableEvent} event
   * @return {Promise<workbox-precaching.CleanupResult>}
   */
  activate(e) {
    return P(e, async () => {
      const t = await self.caches.open(this.strategy.cacheName), s = await t.keys(), a = new Set(this._urlsToCacheKeys.values()), r = [];
      for (const c of s)
        a.has(c.url) || (await t.delete(c), r.push(c.url));
      return { deletedURLs: r };
    });
  }
  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(e) {
    const t = new URL(e, location.href);
    return this._urlsToCacheKeys.get(t.href);
  }
  /**
   * @param {string} url A cache key whose SRI you want to look up.
   * @return {string} The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForCacheKey(e) {
    return this._cacheKeysToIntegrities.get(e);
  }
  /**
   * This acts as a drop-in replacement for
   * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
   * with the following differences:
   *
   * - It knows what the name of the precache is, and only checks in that cache.
   * - It allows you to pass in an "original" URL without versioning parameters,
   * and it will automatically look up the correct cache key for the currently
   * active revision of that URL.
   *
   * E.g., `matchPrecache('index.html')` will find the correct precached
   * response for the currently active service worker, even if the actual cache
   * key is `'/index.html?__WB_REVISION__=1234abcd'`.
   *
   * @param {string|Request} request The key (without revisioning parameters)
   * to look up in the precache.
   * @return {Promise<Response|undefined>}
   */
  async matchPrecache(e) {
    const t = e instanceof Request ? e.url : e, s = this.getCacheKeyForURL(t);
    if (s)
      return (await self.caches.open(this.strategy.cacheName)).match(s);
  }
  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * @param {string} url The precached URL which will be used to lookup the
   * `Response`.
   * @return {workbox-routing~handlerCallback}
   */
  createHandlerBoundToURL(e) {
    const t = this.getCacheKeyForURL(e);
    if (!t)
      throw new h("non-precached-url", { url: e });
    return (s) => (s.request = new Request(e), s.params = Object.assign({ cacheKey: t }, s.params), this.strategy.handle(s));
  }
}
let b;
const x = () => (b || (b = new Q()), b);
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const T = "GET", R = (n) => n && typeof n == "object" ? n : { handle: n };
class w {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, s = T) {
    this.handler = R(t), this.match = e, this.method = s;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = R(e);
  }
}
class Y extends w {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, s) {
    const a = ({ url: r }) => {
      const c = e.exec(r.href);
      if (c && !(r.origin !== location.origin && c.index !== 0))
        return c.slice(1);
    };
    super(a, t, s);
  }
}
class z {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: t } = e, s = this.handleRequest({ request: t, event: e });
      s && e.respondWith(s);
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data, s = Promise.all(t.urlsToCache.map((a) => {
          typeof a == "string" && (a = [a]);
          const r = new Request(...a);
          return this.handleRequest({ request: r, event: e });
        }));
        e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith("http"))
      return;
    const a = s.origin === location.origin, { params: r, route: c } = this.findMatchingRoute({
      event: t,
      request: e,
      sameOrigin: a,
      url: s
    });
    let i = c && c.handler;
    const o = e.method;
    if (!i && this._defaultHandlerMap.has(o) && (i = this._defaultHandlerMap.get(o)), !i)
      return;
    let l;
    try {
      l = i.handle({ url: s, request: e, event: t, params: r });
    } catch (u) {
      l = Promise.reject(u);
    }
    const g = c && c.catchHandler;
    return l instanceof Promise && (this._catchHandler || g) && (l = l.catch(async (u) => {
      if (g)
        try {
          return await g.handle({ url: s, request: e, event: t, params: r });
        } catch (L) {
          L instanceof Error && (u = L);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: s, request: e, event: t });
      throw u;
    })), l;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: t, request: s, event: a }) {
    const r = this._routes.get(s.method) || [];
    for (const c of r) {
      let i;
      const o = c.match({ url: e, sameOrigin: t, request: s, event: a });
      if (o)
        return i = o, (Array.isArray(i) && i.length === 0 || o.constructor === Object && // eslint-disable-line
        Object.keys(o).length === 0 || typeof o == "boolean") && (i = void 0), { route: c, params: i };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, t = T) {
    this._defaultHandlerMap.set(t, R(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = R(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new h("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const t = this._routes.get(e.method).indexOf(e);
    if (t > -1)
      this._routes.get(e.method).splice(t, 1);
    else
      throw new h("unregister-route-route-not-registered");
  }
}
let y;
const J = () => (y || (y = new z(), y.addFetchListener(), y.addCacheListener()), y);
function X(n, e, t) {
  let s;
  if (typeof n == "string") {
    const r = new URL(n, location.href), c = ({ url: i }) => i.href === r.href;
    s = new w(c, e, t);
  } else if (n instanceof RegExp)
    s = new Y(n, e, t);
  else if (typeof n == "function")
    s = new w(n, e, t);
  else if (n instanceof w)
    s = n;
  else
    throw new h("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return J().registerRoute(s), s;
}
function Z(n, e = []) {
  for (const t of [...n.searchParams.keys()])
    e.some((s) => s.test(t)) && n.searchParams.delete(t);
  return n;
}
function* ee(n, { ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/], directoryIndex: t = "index.html", cleanURLs: s = !0, urlManipulation: a } = {}) {
  const r = new URL(n, location.href);
  r.hash = "", yield r.href;
  const c = Z(r, e);
  if (yield c.href, t && c.pathname.endsWith("/")) {
    const i = new URL(c.href);
    i.pathname += t, yield i.href;
  }
  if (s) {
    const i = new URL(c.href);
    i.pathname += ".html", yield i.href;
  }
  if (a) {
    const i = a({ url: r });
    for (const o of i)
      yield o.href;
  }
}
class te extends w {
  /**
   * @param {PrecacheController} precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param {Object} [options] Options to control how requests are matched
   * against the list of precached URLs.
   * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
   * check cache entries for a URLs ending with '/' to see if there is a hit when
   * appending the `directoryIndex` value.
   * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
   * array of regex's to remove search params when looking for a cache match.
   * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
   * check the cache for the URL with a `.html` added to the end of the end.
   * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
   * This is a function that should take a URL and return an array of
   * alternative URLs that should be checked for precache matches.
   */
  constructor(e, t) {
    const s = ({ request: a }) => {
      const r = e.getURLsToCacheKeys();
      for (const c of ee(a.url, t)) {
        const i = r.get(c);
        if (i) {
          const o = e.getIntegrityForCacheKey(i);
          return { cacheKey: i, integrity: o };
        }
      }
    };
    super(s, e.strategy);
  }
}
function se(n) {
  const e = x(), t = new te(e, n);
  X(t);
}
function ne(n) {
  x().precache(n);
}
function ae(n, e) {
  ne(n), se(e);
}
const U = new URL(self.location.toString()), re = "https://api.lxc2.com:8/bingImg", ce = "api.lxc2.com:8/bingImg", I = "bingImg-" + U.origin + U.pathname.substring(0, U.pathname.lastIndexOf("/") + 1);
function ie(n) {
  console.log("sw安装时 缓存必应每日一图"), caches.open(I).then((e) => {
    const t = /* @__PURE__ */ new Date(), s = re + "?date=" + t.getFullYear() + "_" + (t.getMonth() + 1) + "_" + t.getDate(), a = new Request(s, { mode: "cors", credentials: "omit" });
    fetch(a).then((r) => {
      e.put(a, r.clone()).then(() => {
        console.log("[Service Worker] 成功缓存必应每日一图"), n();
      });
    }).catch(() => {
      console.error("[fetch] 访问图片失败");
    });
  }).catch(() => {
    console.error("[cache] 打开bingImg失败");
  });
}
function oe(n, e) {
  return new Promise((t) => {
    n.keys().then((s) => {
      let a = !1;
      for (let r = 0; r < s.length; r++) {
        const c = new URL(s[r].url);
        c.origin === e.origin && //匹配上的规则: 1.请求的服务器、端口一样  2.访问的path一样  3.date参数一样
        c.pathname === e.pathname && c.searchParams.get("date") === e.searchParams.get("date") && (a = !0, n.match(s[r]).then((i) => {
          t(i);
        }).catch(() => {
          console.error("匹配上了但是cache.match()无法返回Response"), t(void 0);
        }));
      }
      a || t(void 0);
    }).catch(() => {
      t(void 0);
    });
  });
}
console.log("[Service Worker] 开始缓存资源...");
ae([{"revision":null,"url":"assets/index-6e76a86d.js"},{"revision":null,"url":"assets/index-80f717a4.css"},{"revision":null,"url":"assets/workbox-window.prod.es5-a7b12eab.js"},{"revision":"16b5c6d9d2572168042eff204d47ce4e","url":"index.html"},{"revision":"v1","url":"website-list.json"},{"revision":"v1","url":"WebsiteIcon/acm.neusoft.edu.cn.ico"},{"revision":"v1","url":"WebsiteIcon/cps.front.neucoding.com.png"},{"revision":"v1","url":"WebsiteIcon/developer.mozilla.org.png"},{"revision":"v1","url":"WebsiteIcon/examcas.neumooc.com.png"},{"revision":"v1","url":"WebsiteIcon/gitee.com.ico"},{"revision":"v1","url":"WebsiteIcon/github.com.png"},{"revision":"v1","url":"WebsiteIcon/hw.neusoft.edu.cn.png"},{"revision":"v1","url":"WebsiteIcon/itestcloud.unipus.cn.png"},{"revision":"v1","url":"WebsiteIcon/jst.neusoft.edu.cn.ico"},{"revision":"v1","url":"WebsiteIcon/mail.dnui.edu.cn.png"},{"revision":"v1","url":"WebsiteIcon/newjw.neusoft.edu.cn.png"},{"revision":"v1","url":"WebsiteIcon/one.neuedu.com.png"},{"revision":"v1","url":"WebsiteIcon/pigai.org.ico"},{"revision":"v1","url":"WebsiteIcon/stu.neusoft.edu.cn.png"},{"revision":"v1","url":"WebsiteIcon/study.neutech.cn.png"},{"revision":"v1","url":"WebsiteIcon/study1230.neuedu.com.png"},{"revision":"v1","url":"WebsiteIcon/vpn.neuedu.com.png"},{"revision":"v1","url":"WebsiteIcon/webvpn.neusoft.edu.cn.png"},{"revision":"v1","url":"WebsiteIcon/www.icourse163.org.png"},{"revision":"f130a0b70e386170cf6f011c0ca8c4f4","url":"img/icons/android-chrome-192x192.png"},{"revision":"0ff1bc4d14e5c9abcacba7c600d97814","url":"img/icons/android-chrome-512x512.png"},{"revision":"845a39478d0e2d4d5d32a092de2de250","url":"img/icons/android-chrome-maskable-192x192.png"},{"revision":"2695f5feb66cdb0c6f09d0e415824cf9","url":"img/icons/android-chrome-maskable-512x512.png"},{"revision":"66830ea6be8e7e94fb55df9f7b778f2e","url":"img/icons/apple-touch-icon.png"},{"revision":"9a2b5c0f19de617685b7b5b42464e7db","url":"img/icons/apple-touch-icon-60x60.png"},{"revision":"af28d69d59284dd202aa55e57227b11b","url":"img/icons/apple-touch-icon-76x76.png"},{"revision":"936d6e411cabd71f0e627011c3f18fe2","url":"img/icons/apple-touch-icon-120x120.png"},{"revision":"1a034e64d80905128113e5272a5ab95e","url":"img/icons/apple-touch-icon-152x152.png"},{"revision":"c43cd371a49ee4ca17ab3a60e72bdd51","url":"img/icons/apple-touch-icon-180x180.png"},{"revision":"4bb1a55479d61843b89a2fdafa7849b3","url":"img/icons/favicon-16x16.png"},{"revision":"98b614336d9a12cb3f7bedb001da6fca","url":"img/icons/favicon-32x32.png"},{"revision":"b89032a4a5a1879f30ba05a13947f26f","url":"img/icons/msapplication-icon-144x144.png"},{"revision":"058a3335d15a3eb84e7ae3707ba09620","url":"img/icons/mstile-150x150.png"},{"revision":"4e857233cbd3bb2d2db4f78bed62a52f","url":"img/icons/safari-pinned-tab.svg"},{"revision":"113f14c35dd083ead3fe1e643da247fa","url":"manifest.webmanifest"}]);
console.log("[Service Worker] 资源缓存结束");
self.addEventListener("install", (n) => {
  n.waitUntil(new Promise(ie));
});
self.addEventListener("message", (n) => {
  n.data === "skipWaiting" && self.skipWaiting().then(() => {
  });
});
self.addEventListener("fetch", (n) => {
  n.respondWith((async () => {
    if (n.request.url.includes(ce)) {
      console.log("fetching bingImg: " + n.request.url);
      const e = await caches.open(I), t = /* @__PURE__ */ new Date(), s = t.getFullYear() + "_" + (t.getMonth() + 1) + "_" + t.getDate(), a = new URL(n.request.url);
      a.searchParams.set("date", s);
      const r = await oe(e, a);
      if (r)
        return console.log("找到缓存: 返回照片缓存"), r;
      {
        const c = await e.keys(), i = new Request(a.href, { mode: "cors", credentials: "omit" });
        if (c.length > 0)
          return console.log("返回旧照片,缓存新照片"), fetch(i).then((o) => {
            e.put(i, o.clone()).then(() => {
              console.log("[Service Worker] 成功缓存文件: " + i.url), c.forEach((l) => {
                e.delete(l);
              }), self.clients.matchAll().then((l) => {
                l.forEach((g) => {
                  g.postMessage("RefreshBackgroundImage");
                });
              });
            }).catch((l) => {
              console.error("更新背景图失败: 文件无法添加到缓存: "), console.error(l);
            });
          }).catch((o) => {
            console.error("更新背景图失败: 网络错误: "), console.error(o);
          }), await e.match(c[0]);
        console.log("没有旧照片，发起网络请求获取新照片");
        try {
          const o = await fetch(i);
          return e.put(i, o.clone()).then(() => {
            console.log("[Service Worker] 成功缓存文件: " + i.url), c.forEach((l) => {
              e.delete(l);
            });
          }), o;
        } catch (o) {
          return console.error("[Service Worker] " + i.url + " 加载失败"), console.error(o), new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" }
          });
        }
      }
    } else
      return fetch(n.request);
  })());
});
