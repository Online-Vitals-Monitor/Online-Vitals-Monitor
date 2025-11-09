# Contributing Guide

How to set up, code, test, review, and release so contributions meet our Definition
of Done.

## Code of Conduct

Our outlines for community behavior and reporting is outlined here in our [Team Charter](https://docs.google.com/document/d/19p_YiyR0qCr-rs2crD8rEdsUUafsTqhl/edit?usp=sharing&ouid=112689279272282278804&rtpof=true&sd=true). Project behavior and git procedures are written below for user guidelines.

## Getting Started

**Prerequisites:**

- Node.js
- npm
- A modern web browser (Chrome, Firefox, Opera)
- An IDE such as VS Code

**Setup Steps**

1. Clone the repository: `git clone https://github.com/Online-Vitals-Monitor/Online-Vitals-Monitor.git` -> `cd Online-Vitals-Monitor`
2. Install dependencies: `cd backend -> npm install` and `cd frontend -> npm install`
3. Start the backend `cd backend` -> `npm run dev`
4. Start the frontend `cd frontend` -> `npm start`

**Environment Variables/Secrets**

Currently, there is no `.env` file that is required for setup.

## Branching & Workflow

Our team uses a feature branch workflow that utilizes pull requests and code reviews. All changes are developed on feature branches and merged into the main branch after passing reviews.

**Default Branch**

`main` is the default branch and represents deployable code

**Feature Branch Naming Convention**

Feature branches shall be named such that `feature/<insert change>`

Examples:

- `feature/add-sidebar-ui`
- `feature/fixing-tests`
- `feature/update-backend-api`

**Rebasing and Merging**

A rebase should happen locally before opening a pull request to keep commit history clean:
`git fetch origin` -> `git rebase main`

## Issues & Planning

All opened tasks are viewable through the [Project Planner](https://github.com/orgs/Online-Vitals-Monitor/projects/3). Within the project, items are clearly labeled with the following to describe the current status:

- Backlog
- In Progress
- Done
- Ready
  All tasks require a description and a status label. Assignments are doled out during team meetings or can be assigned by the individual user. Time estimations are done on a week by week basis, with prior discussion of realistic due dates done before assignment.

Issues are clearly labeled with the following:

- feature
- bug
- documentation
- duplicate
- help wanted
- invalid
- question
- verification

And require a description, asignee, and the relevant [requirement name](https://docs.google.com/document/d/1W0BTbp3VCnYrPEEZz8Con-w3b9ZCTxbzSmS2EL8qqKI/edit?usp=drive_link).

## Commit Messages

State the convention (e.g., Conventional Commits), include examples, and how to
reference issues.

We follow the Conventional Commit standard to ensure commits are descriptive to ensure our commit history is well structured.

Examples:

- `Added new slider for heart rate`
- `Added GET /vitals endpoint test`
- `Removed buggy feature for refactoring`

**Note:** Commits shall be squashed before merging to keep history clean.

## Code Style, Linting & Formatting

Name the formatter/linter, config file locations, and the exact commands to
check/fix locally.

We use **ESLint** to maintain code quality and consistent formatting across the project.
Users can run the following commands to fix linting issues before running:

+`npm run lint` +`npm run lint -- --fix`

Configuration files can be found in the `/backend` and `/frontend` folders respectively:

- /backend/tsconfig.json
- frontend/tsconfig.json

## Testing

Define required test types, how to run tests, expected coverage thresholds, and
when new/updated tests are mandatory.

## Pull Requests & Reviews

Outline PR requirements (template, checklist, size limits), reviewer expectations,
approval rules, and required status checks.

**Pull Request Requirements**

Things to do before submitting a PR:

- Ensure the branch is rebased with the latest version of `main` branch
- The code builds sucessfully and all tests pass locally
- The PR follows the standard GitHub pull request template

**PR Template**

PRs should follow the standard GitHub `.github/pull_request_template.md` message.

**Reviewer Expectations**

- Each PR must be reviewed by at least one project member
- Review comments must be professional and constructive to offer valuable feedback on the code
- Reviewers must check for correctness, readability, and consistency
- Authors of the PR should respond to feedback within 24-72 hours and request a re-review once all comments are addressed

**Approval Rules and Required Status Checks**

- A PR can be merged after it has 1+ approvals by a project member
- All CI checks have passed
- The DoD checklist is complete
- Delete feature branch after merging to `main`

## CI/CD

Link to pipeline definitions, list mandatory jobs, how to view logs/re-run jobs,
and what must pass before merge/release.

## Security & Secrets

State how to report vulnerabilities, prohibited patterns (hard-coded secrets),
dependency update policy, and scanning tools.

## Documentation Expectations

Specify what must be updated (README, docs/, API refs, CHANGELOG) and
docstring/comment standards.

## Release Process

Describe versioning scheme, tagging, changelog generation, packaging/publishing
steps, and rollback process.

## Support & Contact

Provide maintainer contact channel, expected response windows, and where to ask
questions.

**Communication Channels**

- Primary: The main Discord server
- Secondary: GitHub issues for tracking bugs/feature enhancements
- Meetings: Weekly on Microsoft Teams/Discord Voice Chat

**Response Windows**

Project members are expected to respond within 24-72 hours.

**Where to Ask Questions**

Questions are to be asked through the main project Discord server.
