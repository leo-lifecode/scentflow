import test from "node:test";
import assert from "node:assert/strict";
import { requireRole } from "../src/middleware/auth.middleware";

test("requireRole returns 401 when authentication is missing", () => {
  let statusCode = 0;
  let payload: unknown;
  let nextCalled = false;

  const req = {} as any;
  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(body: unknown) {
      payload = body;
      return this;
    },
  } as any;

  requireRole("admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 401);
  assert.deepEqual(payload, { message: "Authentication diperlukan" });
  assert.equal(nextCalled, false);
});

test("requireRole returns 403 for an authenticated non-admin", () => {
  let statusCode = 0;
  let payload: unknown;
  let nextCalled = false;

  const req = { user: { id: "user-1", role: "customer" } } as any;
  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(body: unknown) {
      payload = body;
      return this;
    },
  } as any;

  requireRole("admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 403);
  assert.deepEqual(payload, { message: "Tidak memiliki akses" });
  assert.equal(nextCalled, false);
});

test("requireRole allows an admin", () => {
  let nextCalled = false;

  const req = { user: { id: "admin-1", role: "admin" } } as any;
  const res = {} as any;

  requireRole("admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
