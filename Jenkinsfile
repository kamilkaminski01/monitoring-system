pipeline {
  agent any

  stages {
    stage('Checkout repository') {
      steps {
        git 'https://github.com/kamilkaminski01/monitoring-system.git'
      }
    }
    stage('Docker build') {
      steps {
        echo 'Building...'
        sh 'make build ENV=prod'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying'
        sh 'make run ENV=prod'
      }
    }
  }
}
