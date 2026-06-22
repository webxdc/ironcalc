# Vendored dependencies

## ironcalc

A copy of IronCalc from https://github.com/ironcalc/IronCalc/pull/1146, commit
`fcec9519a1bad3f3520e980d0a8b214e9fe3be69`.

This has a PR modifying ``@ironcalc/workbook` with a modification that allows
editing to proceed without losing focus/text.

See [Building](../README.md#building) for how to build it.

### Local modifications

There is a single modification made:

`bindings/wasm/Makefile`: `npx tsc` gained `--ignoreConfig`.

This is because the vendored directory is within our own calc project with its own
tsconfig. TypeScript walks up the directory parent chain and finds it, which breaks
the build.
