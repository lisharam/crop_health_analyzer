pipeline {
  agent any

  environment {
    NODE_VERSION = '18'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup Node') {
      steps {
        // Use nvm or a preinstalled node on the agent. Adjust if your Jenkins agents require a different setup.
        sh 'node --version || true'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Unit Tests') {
      steps {
        sh 'npm test --silent'
      }
    }

    stage('Integration Tests') {
      steps {
        script {
          // If credentials are available, inject them. Otherwise run with mocked AI.
          if (env.OPENAI_API_KEY && env.PROXY_TOKEN) {
            sh 'echo "Running integration tests with real OpenAI key"'
            sh 'OPENAI_API_KEY="$OPENAI_API_KEY" PROXY_TOKEN="$PROXY_TOKEN" npm run test:integration --silent'
          } else {
            sh 'echo "OPENAI_API_KEY/PROXY_TOKEN not set — running integration tests with MOCK_OPENAI=true"'
            sh 'MOCK_OPENAI=true PROXY_TOKEN=test-token npm run test:integration --silent'
          }
        }
      }
    }

    stage('Build') {
      steps {
        withEnv(["OPENAI_API_KEY=${env.OPENAI_API_KEY}", "PROXY_TOKEN=${env.PROXY_TOKEN}"]) {
          sh 'npm run build'
        }
      }
    }

    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'dist/**', fingerprint: true, allowEmptyArchive: true
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'coverage/**/junit.xml'
      cleanWs()
    }
  }
}
