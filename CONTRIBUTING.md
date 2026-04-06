# Contributing to ab-utils

## Branch Protections
The `#master` branch is protected on GitHub and requires opening a pull request with passing checks. These checks will run when the pull request is opened and need to pass before merging:
1. Unit Tests - Unit test in mocha can be run locally with the `npm test` script.
1. CodeQL - Automatically scans code for potential problems.
1. Check PR Label - Checks for a valid label on the pull requests, needed for automated releases (see below).

## Automated Releases
Pull Requests merged into master will automatically create a new version and publish to npm.
The Pull Requsest should be labeled with either `major`, `minor`, `patch`, or `no_release`.
label | for
--- | ---
`major` | Breaking Changes 
`minor` | New Features
`patch` | Bug Fixes
`no_release` | Changes that do not need to publish

The body of your Pull Request will be used as Release Notes in the GitHub release. In general try to format as:
```markdown
Summary of your changes
- specific change
- specific change 
...
```

## Documentation
Documentation is generated using [jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown). Comment code using [jsdoc](https://jsdoc.app) style comments. Then use the script:
```bash
npm run docs
```

`README.md` is generated through jsdoc-to-markdown. To make changes, edit the template `docs\README.hbs`.
