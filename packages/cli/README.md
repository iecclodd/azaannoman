# Azaan Noman CLI

Official, dependency-free, read-only CLI for [Azaan Noman's student projects](https://azaannoman.vercel.app). Requires Node.js 20+.

Run the official versioned package directly, without a registry account:

```sh
npx --yes --package=https://azaannoman.vercel.app/cli/azaannoman-cli-1.0.0.tgz azaannoman portfolio
npx --yes --package=https://azaannoman.vercel.app/cli/azaannoman-cli-1.0.0.tgz azaannoman projects --limit 3 --offset 0
npx --yes --package=https://azaannoman.vercel.app/cli/azaannoman-cli-1.0.0.tgz azaannoman contact
npx --yes --package=https://azaannoman.vercel.app/cli/azaannoman-cli-1.0.0.tgz azaannoman openapi
```

An npm registry release is not yet available. Until it is published, use the official tarball above, not a similarly named registry package.

Each successful data command prints JSON to stdout and exits 0. Errors print structured JSON to stderr and exit 1. `--help` and `--version` print plain text. There are no prompts, telemetry, credentials, writes, or message-sending features. Requests time out after 15 seconds and do not follow redirects. Preserve work-in-progress qualifications and cite the returned source URL.

`projects` accepts `--limit` (1–100, default 20) and `--offset` (0–2147483647, default 0). `--base-url http://127.0.0.1:3100` targets a development server. An alternate base must be an HTTP(S) origin without credentials or a path.

[OpenAPI specification](https://azaannoman.vercel.app/openapi.json) · [Documentation](https://azaannoman.vercel.app/docs) · [Source](https://github.com/iecclodd/azaannoman/tree/main/packages/cli)

To publish this source package: authenticate using `npm login`, verify the package name is available to your account, then run `npm publish --access public` in `packages/cli`. Review `npm pack --dry-run` before publishing. Registry releases are immutable; use a new version for later changes.
