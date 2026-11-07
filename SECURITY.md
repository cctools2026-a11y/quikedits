# Security Policy

## Scope

QuikEdits is a fully client-side, static website. All image processing happens
locally in the visitor's browser — there is no backend, database, user account
system, or image storage. Photos never leave the user's device.

Because of this architecture, the most relevant security concerns are:

- Vulnerabilities in the site code or its dependencies that could affect
  visitors' browsers (e.g. cross-site scripting).
- Tampered or malicious content served from the site or its CDN assets.
- Issues in the build/deployment pipeline that could compromise the published
  site.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.**

Instead, report them privately using GitHub's
[private vulnerability reporting](https://github.com/cctools2026-a11y/quikedits/security/advisories/new)
for this repository.

Please include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a proof of concept.
- The affected page(s), browser, and device where relevant.

## What to Expect

- We will acknowledge your report within **7 days**.
- We will investigate and aim to resolve confirmed vulnerabilities within
  **90 days**, depending on severity and complexity.
- We will keep you informed of progress and coordinate public disclosure with
  you once a fix is available.
- We will not take legal action against researchers who report vulnerabilities
  in good faith, follow this policy, and avoid accessing or modifying other
  users' data.

## Supported Versions

Only the latest deployed version of the site (the `main` branch) is supported
with security updates. There are no maintained legacy versions.

## Out of Scope

- Vulnerabilities in third-party services we link to but do not operate.
- The upstream `@imgly/background-removal` library — please report those to
  [IMG.LY](https://github.com/imgly/background-removal-js/security) directly,
  though we're happy to hear about them too.
- Denial-of-service attacks against hosting infrastructure.
- Issues requiring physical access to a user's device.
