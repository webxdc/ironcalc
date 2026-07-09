# Changelog

All notable changes to this project are documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- A bug where simultaneously editing in multiple instances of Calc causes the focus to
  be lost as well as text input to be lost.

- `pnpm dev` was not properly showing the calc, fix by including a webxdc mock.
 
### Tooling

- Webxdc-dev integrated in `package.json`.

- In vite dev mode we now get logging of what is sent through webxdc.

- Playwright tests that demonstrate the editor focus/text loss bug (which now pass).

### Code structure

- Vendor an unreleased version of IronCalc. This is required to fix the bug until
  we can get a new IronCalc release with our fix in. It's based on this PR:
  https://github.com/ironcalc/IronCalc/pull/1146.

## [1.0.0] - 2025-06-24

Initial public release.
