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
        try {
            sh 'make build'
            updateGitlabCommitStatus name: 'Build', state: 'success'
        } catch (exc) {
            onError('Build')
            throw exc
        }
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
            try {
                sh 'make pytest'
                updateGitlabCommitStatus name: 'Tests', state: 'success'
            } catch (exc) {
                onError('Tests')
                throw exc
            }
        }

        stage('Clean code check') {
            echo 'Running static code checks...'
            updateGitlabCommitStatus name: 'Clean code check', state: 'running'
            try {
                sh 'make check'
                updateGitlabCommitStatus name: 'Clean code check', state: 'success'
            } catch (exc) {
                onError('Clean code check')
                throw exc
            }
        }

        sh 'docker compose -f docker-compose.yml stop'
    }

    def IMAGES_REPO = getImagesRepository()
    def PROJECT = getProject()

    stage('Docker build') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: 'Docker build', state: 'running'
            try {
                sh """docker build -t ${IMAGES_REPO}:backend backend"""
                sh """docker build -t ${IMAGES_REPO}:frontend frontend"""
                updateGitlabCommitStatus name: 'Docker build', state: 'success'
            } catch (exc) {
                onError('Docker build')
                throw exc
            }
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage('Docker push') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: 'Docker push', state: 'running'
            try {
                withCredentials([
                    string(credentialsId: 'REGISTRY_PASSWORD', variable: 'REGISTRY_PASSWORD')
                ]) {
                    withEnv([
                        "REGISTRY_USER=${env.REGISTRY_USER}",
                        "IMAGES_REPO=${IMAGES_REPO}"
                    ]) {
                        sh 'docker login -u $REGISTRY_USER -p $REGISTRY_PASSWORD'
                        sh 'docker push $IMAGES_REPO:backend'
                        sh 'docker push $IMAGES_REPO:frontend'
                        sh 'docker logout'
                    }
                }
                updateGitlabCommitStatus name: 'Docker push', state: 'success'
            } catch (exc) {
                onError('Docker push')
                throw exc
            }
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage('Deploy') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: 'Deploy', state: 'running'
            try {
                withCredentials([
                    string(credentialsId: 'REGISTRY_PASSWORD', variable: 'REGISTRY_PASSWORD'),
                    string(credentialsId: 'SSH_USER', variable: 'SSH_USER'),
                    string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                ]) {
                    withEnv([
                        "REGISTRY_USER=${REGISTRY_USER}",
                        "IMAGES_REPO=${IMAGES_REPO}",
                        "PROJECT=${PROJECT}"
                    ]) {
                        sh 'ssh $SSH_USER@$SSH_HOST "
                            cd $PROJECT/ &&
                            docker login -u $REGISTRY_USER -p $REGISTRY_PASSWORD &&
                            make down env=prod &&
                            docker images -q $IMAGES_REPO | xargs -r docker rmi &&
                            make run env=prod"'
                    }
                }
                updateGitlabCommitStatus name: 'Deploy', state: 'success'
            } catch (exc) {
                onError('Deploy')
                throw exc
            }
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }
}

// Run when stage in build fails
def onError(stage) {
    echo "Build failed on stage ${stage}"
    updateGitlabCommitStatus name: "${stage}", state: 'failed'
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
        currentBuild.result = 'FAILURE'
        throw exc
    } finally {
        onFinal()
    }
}
