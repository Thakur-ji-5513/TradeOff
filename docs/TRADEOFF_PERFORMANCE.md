# TradeOff Performance Optimization Report

This document records the performance investigations, empirical benchmarks, query execution plans, and production optimizations implemented for the TradeOff application.

---

## 1. Frontend Concurrent Data-Fetching (`Promise.all()`)

### Overview
In the initial dashboard implementation, user tradeoffs and user profile data were fetched sequentially:

```javascript
// Original sequential pattern (~1829 ms median)
const data = await getMyTradeoffs();
const userData = await getProfile();
```

### Optimization Implemented
Because `getMyTradeoffs()` and `getProfile()` are independent network calls, they were refactored to execute concurrently:

```javascript
// Optimized concurrent pattern (~1099 ms median)
const [data, userData] = await Promise.all([
  getMyTradeoffs(),
  getProfile(),
]);
```

### Results
- **Before Median Fetch Completion Time**: ~1829 ms
- **After Median Fetch Completion Time**: ~1099 ms
- **Improvement**: ~40% reduction in dashboard loading latency.

---

## 2. Backend Database Query Optimization (`GET /api/tradeoff/my`)

### Problem Statement
The `GET /api/tradeoff/my` route retrieves the authenticated user's tradeoffs sorted by creation date:

```javascript
const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

await Tradeoff.deleteMany({
  createdBy: req.userId,
  status: "pending",
  createdAt: { $lt: twentyFourHoursAgo }
});

const Tradeoffs = await Tradeoff.find({ createdBy: req.userId }).sort({ createdAt: -1 });
```

Previously, the `Tradeoff` schema had a `createdBy` reference field, but lacked an explicit compound index on `{ createdBy: 1, createdAt: -1 }`.

### Why the Compound Index Matches the Query Pattern
The query filters documents by `createdBy` and requests the output pre-sorted by `createdAt` descending (`-1`). A compound index on `{ createdBy: 1, createdAt: -1 }` matches both the equality predicate (`createdBy`) and the sort key (`createdAt: -1`), allowing MongoDB to satisfy the query order directly from the index without an in-memory sort.

### Query Plan Comparison (`.explain("executionStats")`)

| Metric / Stage | Without Index (Baseline) | With Compound Index (`{ createdBy: 1, createdAt: -1 }`) |
| :--- | :--- | :--- |
| **Winning Stage** | `COLLSCAN` + `SORT` | `IXSCAN` (`createdBy_1_createdAt_-1`) + `FETCH` |
| **Documents Examined** | 14 (Scanned total collection) | 4 (Scanned user documents only) |
| **Index Keys Examined**| 0 | 4 |
| **Documents Returned** | 4 | 4 |
| **Sort Mechanism** | In-memory sort (`memLimit: 32MB`) | Index-assisted (Zero in-memory sort stage) |

### Benchmark Methodology
- High-resolution timing (`performance.now()`) was inserted into the route handler to capture database sub-operations separately.
- 10 sequential benchmark runs were conducted under identical network and MongoDB Atlas conditions.
- Metrics recorded: `find().sort()` duration, `/my` handler duration, and total end-to-end HTTP fetch latency.

### Measured Empirical Performance

| Metric | Baseline (Without Index) | Optimized (With Index) | Delta / Percentage Reduction |
| :--- | :---: | :---: | :---: |
| **`find().sort()` Median** | **71.934 ms** | **68.163 ms** | **-3.771 ms (-5.2%)** |
| **`/my` Handler Median** | **146.652 ms** | **139.393 ms** | **-7.259 ms (-4.9%)** |
| **End-to-End Fetch Median** | **150.132 ms** | **143.105 ms** | **-7.027 ms (-4.7%)** |

### Data Interpretation & Engineering Context
- **Modest Absolute Improvement**: The measured latency reduction (~7.26 ms / ~4.9% median handler improvement) is modest on the current dataset because the database collection contains 14 documents, and network round-trip time (RTT) to cloud-hosted MongoDB Atlas (~65–70 ms per database call) dominates overall endpoint execution time.
- **Query Planner Optimization**: The primary engineering value of the index is structural: the execution plan changed from `COLLSCAN + SORT` to `IXSCAN + FETCH`, eliminating in-memory sorting overhead.

### Permanent Implementation
The following compound index was permanently added to `Server/models/tradeoff.js`:

```javascript
tradeoffSchema.index({
  createdBy: 1,
  createdAt: -1,
});
```

### Unimplemented Cleanup / Background Job Strategy
During instrumentation, measurements revealed that `deleteMany()` accounts for ~50% (~73.6 ms) of the handler execution time because it runs synchronously on every read call. Alternative approaches such as TTL indexes, background cron jobs, or asynchronous deletion were evaluated but **intentionally not implemented**. Keeping the cleanup synchronous preserves existing transactional and deterministic endpoint behavior, ensuring zero unintended side effects or breaking API changes.
