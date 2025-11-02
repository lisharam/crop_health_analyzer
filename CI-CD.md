## Continuous Integration and Deployment (CI/CD)

This project uses GitHub Actions for automated testing, linting, and deployment.

### CI Pipeline

The CI pipeline runs on every push to `main` and pull requests:

- Runs tests on Node.js 16.x and 18.x
- Performs ESLint code quality checks
- Validates HTML5 markup
- Checks image URLs for broken links

To run CI checks locally:
```bash
npm run ci  # Runs both lint and test
```

### CD Pipeline

The CD pipeline automatically deploys to GitHub Pages when changes are pushed to `main`:

- Triggers on changes to HTML, JS, CSS, or package.json
- Builds and optimizes assets
- Deploys to the gh-pages branch

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run tests locally: `npm test`
4. Run linter: `npm run lint`
5. Create a pull request to `main`
6. Wait for CI checks to pass
7. Request review and merge

### Testing

We use Jest for unit testing. Run tests locally:
```bash
npm test
```

Add new tests in `*.test.js` files next to the code being tested.

### Linting

We use ESLint to maintain code quality. Run the linter:
```bash
npm run lint
```

ESLint configuration is in `.eslintrc.json`.