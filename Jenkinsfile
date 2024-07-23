import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def getGitlabConnection() {
    return 'gitlab'
}

def getDeployBranches() {
    return ['master']
}

def getProject() {
    return 'monitoring-system'
}

// return True if current build should be pushed to a registry and deployed
def isDeployBranch() {
    def DEPLOY_BRANCHES = getDeployBranches()
    echo 'Checking if branch: ' + env.BRANCH_NAME + ' is one of: ' + DEPLOY_BRANCHES
    return DEPLOY_BRANCHES.contains(env.BRANCH_NAME)
}

def getImagesRepository() {
    def PROJECT = getProject()
    return env.REGISTRY_USER + '/' + PROJECT
}

def onBuild() {
    def GITLAB_CONNECTION = getGitlabConnection()
    properties([gitLabConnection(GITLAB_CONNECTION)])

    echo 'Build for branch: ' + env.BRANCH_NAME

    stage('Checkout repository') {
        checkout scm
    }

    stage('Build') {
        echo 'Building...'
        updateGitlabCommitStatus name: 'Build', state: 'running'
        sh 'make build'
        updateGitlabCommitStatus name: 'Build', state: 'success'
    }

    def SHOULD_DEPLOY = isDeployBranch()
    if (SHOULD_DEPLOY) {
        echo 'Performing deployment'
    } else {
        echo 'Running tests with no deployment'
    }

    // Need to be sure that other builds are for example not using
    // same ports - that is why those stages have to be locked
    // and just after services have to be stopped
    lock("docker_compose_run") {
        stage('Tests') {
            echo 'Testing...'
            updateGitlabCommitStatus name: 'Tests', state: 'running'
            sh 'make pytest'
            updateGitlabCommitStatus name: 'Tests', state: 'success'
        }

        stage('Clean code check') {
            echo 'Running static code checks...'
            updateGitlabCommitStatus name: 'Clean code check', state: 'running'
            sh 'make check'
            updateGitlabCommitStatus name: 'Clean code check', state: 'success'
        }

        sh 'docker compose -f docker-compose.yml stop'
    }

    def IMAGES_REPO = getImagesRepository()

    stage('Docker build') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: 'Docker build', state: 'running'
            sh """docker build -t ${IMAGES_REPO}:backend backend"""
            sh """docker build -t ${IMAGES_REPO}:frontend frontend"""
            updateGitlabCommitStatus name: 'Docker build', state: 'success'
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    environment {
        REGISTRY_PASSWORD = credentials('REGISTRY_PASSWORD')
    }

    stage('Docker push') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: 'Docker push', state: 'running'
            withCredentials([
                string(credentialsId: 'REGISTRY_PASSWORD', variable: 'REGISTRY_PASSWORD'),
            ]) {
                sh """docker login -u ${env.REGISTRY_USER} -p ${REGISTRY_PASSWORD}"""
                sh """docker push ${IMAGES_REPO}:backend"""
                sh """docker push ${IMAGES_REPO}:frontend"""
                sh 'docker logout'
            }
            updateGitlabCommitStatus name: 'Docker push', state: 'success'
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }
}

// Run when build fail
def onError() {
    echo 'Build failed'
    updateGitlabCommitStatus name: 'Build', state: 'failed'
}

// Run always at the end of the build
def onFinal() {
    echo "Cleaning up docker compose..."
    sh 'make clear'
    cleanWs()
}

node {
    try {
        onBuild()
        currentBuild.result = 'SUCCESS'
    } catch (exc) {
        onError()
        currentBuild.result = 'FAILURE'
        throw exc
    } finally {
        onFinal()
    }
}
