# Performance assessment

**Type:** static source assessment  
**Date:** 2026-09-23  
**No measurements recorded:** The repository has no Lighthouse report, Web Vitals capture, bundle analysis, load test, database-query profile, production RUM dashboard, or performance budget.

## Source-level risks

| Area | Observation | Likely consequence as history grows |
| --- | --- | --- |
| Dashboard | Reads all matching moods, tasks, and focus sessions, then filters/sorts client-side | More Firestore reads, slower dashboard, greater bandwidth/billing |
| History | Reads all matching sessions and moods, then joins/sorts client-side | Increasing initial load and memory work |
| Export | Reads full matching collections in one request and builds JSON in memory | Large responses, server time/memory pressure |
| Deletion | Deletes queried documents in recursive batches of 100 | Long-running request/partial-failure risk for large accounts |
| Focus checkpoint | Writes session state every 15 seconds while active | Regular write cost and sensitivity to network failure |
| Service worker | Caches all same-origin GET responses | Cache growth/staleness and sensitive-response risk |
| Update prompt | Polls the version endpoint every five minutes while mounted | Small recurring request overhead |

## Source-level positives

- The app uses Next.js production builds and static public assets.
- The service worker is network first, so it prefers fresh successful network responses.
- Focus state is checkpointed rather than only saved when the timer completes.

These observations do not establish a fast user experience, a defined capacity, or acceptable Core Web Vitals.

## Measurement plan

Measure authenticated dashboard/history load with representative and high-volume data, Firestore read counts/latency, API export/deletion duration, client bundle size, cache growth, and browser Web Vitals. Introduce pagination/bounds/aggregates only after validating data needs and Firestore indexes. Test any PWA caching change for both performance and privacy effects.
