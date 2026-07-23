const assert = require('assert');
const path = require('path');

const { ApiError } = require('../utils/apiResponse');
const { protect } = require('../middlewares/auth.middleware');
const {
  authorize,
  restrictTo,
  requireSeller,
  requireBuyer,
  requireAnyRole,
} = require('../middlewares/role.middleware');
const generateToken = require('../utils/generateToken');
const User = require('../models/User.model');

// Helper to create mock req, res, next
function createMockCtx(headers = {}, user = null) {
  const req = {
    headers,
    user,
  };
  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  let nextCalled = false;
  let nextError = null;
  const next = (err) => {
    nextCalled = true;
    if (err) nextError = err;
  };

  return { req, res, next, isNextCalled: () => nextCalled, getNextError: () => nextError };
}

async function runMiddlewareUnitTests() {
  console.log('====================================================');
  console.log('      UNIT TESTS: AUTH & ROLE MIDDLEWARE           ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`  ✓ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  async function asyncTest(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  // ───────────────────────────────────────────────────────────
  // 1. UNIT TESTS: protect middleware
  // ───────────────────────────────────────────────────────────
  console.log('--- 1. Testing `protect` Middleware ---');

  await asyncTest('protect() throws 401 when Authorization header is missing', async () => {
    const { req, res, next, getNextError } = createMockCtx({});
    await protect(req, res, next);
    await new Promise((r) => setTimeout(r, 20));
    const err = getNextError();
    assert.ok(err instanceof ApiError, 'Should pass ApiError to next()');
    assert.strictEqual(err.statusCode, 401);
    assert.strictEqual(err.message, 'Not authorized. No token provided.');
  });

  await asyncTest('protect() throws 401 when Bearer prefix is missing', async () => {
    const { req, res, next, getNextError } = createMockCtx({ authorization: 'Basic 12345' });
    await protect(req, res, next);
    await new Promise((r) => setTimeout(r, 20));
    const err = getNextError();
    assert.ok(err instanceof ApiError);
    assert.strictEqual(err.statusCode, 401);
  });

  await asyncTest('protect() throws 401 on invalid JWT token', async () => {
    const { req, res, next, getNextError } = createMockCtx({ authorization: 'Bearer invalid.token.value' });
    await protect(req, res, next);
    await new Promise((r) => setTimeout(r, 20));
    const err = getNextError();
    assert.ok(err instanceof ApiError);
    assert.strictEqual(err.statusCode, 401);
    assert.strictEqual(err.message, 'Invalid token. Please login again.');
  });

  await asyncTest('protect() attaches req.user and calls next() on valid token', async () => {
    const mockUser = {
      _id: '60d5ecb8b3b3a80015f8c123',
      name: 'Valid User',
      role: 'buyer',
      isActive: true,
    };

    const token = generateToken({ id: mockUser._id, role: mockUser.role });
    const { req, res, next, isNextCalled } = createMockCtx({ authorization: `Bearer ${token}` });

    const originalFindById = User.findById;
    User.findById = function () {
      return { select: () => Promise.resolve(mockUser) };
    };

    try {
      await protect(req, res, next);
      assert.ok(isNextCalled(), 'next() should be called');
      assert.deepStrictEqual(req.user, mockUser, 'req.user should match mockUser');
    } finally {
      User.findById = originalFindById;
    }
  });

  await asyncTest('protect() throws 403 when user account is deactivated', async () => {
    const mockUser = {
      _id: '60d5ecb8b3b3a80015f8c124',
      name: 'Deactivated User',
      role: 'buyer',
      isActive: false,
    };

    const token = generateToken({ id: mockUser._id, role: mockUser.role });
    const { req, res, next, getNextError } = createMockCtx({ authorization: `Bearer ${token}` });

    const originalFindById = User.findById;
    User.findById = function () {
      return { select: () => Promise.resolve(mockUser) };
    };

    try {
      await protect(req, res, next);
      await new Promise((r) => setTimeout(r, 20));
      const err = getNextError();
      assert.ok(err instanceof ApiError, 'Should receive ApiError');
      assert.strictEqual(err.statusCode, 403);
      assert.strictEqual(err.message, 'Your account has been deactivated.');
    } finally {
      User.findById = originalFindById;
    }
  });

  // ───────────────────────────────────────────────────────────
  // 2. UNIT TESTS: authorize / restrictTo middleware
  // ───────────────────────────────────────────────────────────
  console.log('\n--- 2. Testing `authorize` & `restrictTo` Middleware ---');

  test('authorize() throws 401 if req.user is undefined', () => {
    const { req, res, next } = createMockCtx({}, null);
    const middleware = authorize('seller');
    assert.throws(() => middleware(req, res, next), (err) => err.statusCode === 401);
  });

  test('authorize() throws 403 if req.user.role does not match allowed roles', () => {
    const { req, res, next } = createMockCtx({}, { role: 'buyer' });
    const middleware = authorize('seller');
    assert.throws(() => middleware(req, res, next), (err) => err.statusCode === 403);
  });

  test('authorize() calls next() if req.user.role matches allowed role', () => {
    const { req, res, next, isNextCalled } = createMockCtx({}, { role: 'seller' });
    const middleware = authorize('seller');
    middleware(req, res, next);
    assert.ok(isNextCalled());
  });

  test('authorize() supports multiple roles (e.g. buyer and seller)', () => {
    const middleware = authorize('buyer', 'seller');

    const ctxBuyer = createMockCtx({}, { role: 'buyer' });
    middleware(ctxBuyer.req, ctxBuyer.res, ctxBuyer.next);
    assert.ok(ctxBuyer.isNextCalled(), 'Buyer should be allowed');

    const ctxSeller = createMockCtx({}, { role: 'seller' });
    middleware(ctxSeller.req, ctxSeller.res, ctxSeller.next);
    assert.ok(ctxSeller.isNextCalled(), 'Seller should be allowed');

    const ctxAdmin = createMockCtx({}, { role: 'guest' });
    assert.throws(() => middleware(ctxAdmin.req, ctxAdmin.res, ctxAdmin.next), (err) => err.statusCode === 403);
  });

  test('restrictTo is an alias for authorize', () => {
    assert.strictEqual(restrictTo, authorize);
  });

  // ───────────────────────────────────────────────────────────
  // 3. UNIT TESTS: requireSeller & requireBuyer
  // ───────────────────────────────────────────────────────────
  console.log('\n--- 3. Testing `requireSeller` & `requireBuyer` Helpers ---');

  test('requireSeller() allows seller and blocks buyer', () => {
    const ctxSeller = createMockCtx({}, { role: 'seller' });
    requireSeller(ctxSeller.req, ctxSeller.res, ctxSeller.next);
    assert.ok(ctxSeller.isNextCalled());

    const ctxBuyer = createMockCtx({}, { role: 'buyer' });
    assert.throws(() => requireSeller(ctxBuyer.req, ctxBuyer.res, ctxBuyer.next), (err) => err.statusCode === 403);
  });

  test('requireBuyer() allows buyer and blocks seller', () => {
    const ctxBuyer = createMockCtx({}, { role: 'buyer' });
    requireBuyer(ctxBuyer.req, ctxBuyer.res, ctxBuyer.next);
    assert.ok(ctxBuyer.isNextCalled());

    const ctxSeller = createMockCtx({}, { role: 'seller' });
    assert.throws(() => requireBuyer(ctxSeller.req, ctxSeller.res, ctxSeller.next), (err) => err.statusCode === 403);
  });

  test('requireAnyRole() allows any authenticated user', () => {
    const ctxBuyer = createMockCtx({}, { role: 'buyer' });
    requireAnyRole(ctxBuyer.req, ctxBuyer.res, ctxBuyer.next);
    assert.ok(ctxBuyer.isNextCalled());

    const ctxSeller = createMockCtx({}, { role: 'seller' });
    requireAnyRole(ctxSeller.req, ctxSeller.res, ctxSeller.next);
    assert.ok(ctxSeller.isNextCalled());
  });

  console.log(`\n====================================================`);
  console.log(` SUMMARY: Passed ${passedTests} of ${totalTests} unit tests.`);
  console.log(`====================================================`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runMiddlewareUnitTests().catch(console.error);
