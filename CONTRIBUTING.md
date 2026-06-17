# Contributing to FINPAL™ SalesOS

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — deployed to app.finpal.online |
| `develop` | Integration branch — staging deploys |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `hotfix/*` | Urgent production fixes |

## Workflow

1. Branch from `develop`: `git checkout -b feature/your-feature`
2. Make your changes
3. Write/update tests
4. `git push origin feature/your-feature`
5. Open PR to `develop`
6. Tag `@ZenithPro-sys` for review
7. Squash merge when approved

## Commit Format

```
type(scope): short description

feat(crm): add lead scoring algorithm
fix(auth): resolve JWT refresh race condition
docs(api): update contact endpoints
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Style

- TypeScript strict mode
- ESLint + Prettier (run `npm run lint` before pushing)
- Component files: PascalCase
- Utility files: camelCase
- Always type your props — no `any`

## Questions?

Tag `@ZenithPro-sys` or message Tanya on Base44.
