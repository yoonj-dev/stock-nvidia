# Handoff: stock-nvidia (STOCK-DEPLOY-REPAIR-002)

## Last Updated
- 2026-11-02 01:50 KST (Deployment & CI Config Update)

## Current Status
- **Active Project**: `stock-nvidia`
- **Deployment Target**: `nvda.on-tap.xyz`, `nvidia.on-tap.xyz`
- **State**: Deployment completed and verified locally. Git commit/push pending.

## Recent Context & Decisions
- [x] Implemented custom domain routing: `routes = [{ pattern = "nvda.on-tap.xyz", custom_domain = true }, { pattern = "nvidia.on-tap.xyz", custom_domain = true }]`.
- [x] Added GitHub Actions deployment workflow for Node 22.
- [x] Verified local build and production deployment via Wrangler.
- [x] Confirmed endpoint reachability (HTTP 200).

## In-Progress / Next Action
- [ ] Finalize Git repository state: commit/push `wrangler.toml`, `.github/workflows/deploy.yml`, `.agents/HANDOFF.md`, and updated `CHANGELOG.md`.
- [ ] Verify GitHub Actions run result for this deployment.
