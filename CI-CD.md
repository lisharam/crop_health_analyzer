# Continuous Integration and Deployment (CI/CD)

This project uses GitHub Actions for automated testing, linting, and deployment to GitHub Pages.

## GitHub Secrets Setup

The CI/CD pipelines require these secrets to be set up in your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:

### Required Secrets

- `OPENAI_API_KEY`: Your OpenAI API key
  - Value format: `sk-...` (get from OpenAI dashboard)
  - Used by: Integration tests and production deployment

- `PROXY_TOKEN`: Random secure token for API authentication
  - Value format: Any secure random string (32+ characters)
  - Used by: Integration tests and production deployment
  - You can generate one using PowerShell:
    ```powershell
    $randomBytes = New-Object byte[] 32
    [System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($randomBytes)
    [Convert]::ToBase64String($randomBytes)
    ```

## CI Pipeline

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

We use Jest for unit testing and integration testing:
```bash
# Run unit tests (with dummy API key)
npm test

# Run integration tests (requires real OPENAI_API_KEY)
npm run test:integration
```

Add new tests in `*.test.js` files next to the code being tested.

### Testing Secrets Locally

1. Create `.env` from example and add your secrets:
```powershell
copy .env.example .env
# Edit .env and add:
# OPENAI_API_KEY=sk-your-key-here
# PROXY_TOKEN=your-secure-token
```

2. Test the API endpoint:
```powershell
$headers = @{ 
    'X-Proxy-Token' = $env:PROXY_TOKEN
    'Content-Type' = 'application/json'
}
$body = @{
    prompt = "Test prompt"
    lang = "en"
} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/ai' -Method Post -Headers $headers -Body $body
```

### Security Notes

- Never commit `.env` file (it's in `.gitignore`)
- GitHub automatically redacts secrets from logs
- Use different tokens for development and production
- Rotate secrets periodically
- Monitor GitHub Actions usage and set up spending limits

### Linting

We use ESLint to maintain code quality. Run the linter:
```bash
npm run lint
```

ESLint configuration is in `.eslintrc.json`.