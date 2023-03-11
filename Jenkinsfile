pipeline {
    agent any

    environment {
        registry = "230537183951.dkr.ecr.eu-central-1.amazonaws.com/monitoring-system"
    }

  stages {
    stage('Checkout repository') {
        steps {
          checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/kamilkaminski01/monitoring-system.git']])
        }
    }

    stage('Docker Stop and Build') {
      steps{
        script {
          sh 'make down'
          sh 'make build ENV=prod'
          dockerImage = docker.build registry
        }
      }
    }

    stage('Docker Push') {
      steps {
        script {
          sh 'aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 230537183951.dkr.ecr.eu-central-1.amazonaws.com'
          sh 'docker push 230537183951.dkr.ecr.us-east-2.amazonaws.com/monitoring-system:latest'
        }
      }
    }
  }
}
