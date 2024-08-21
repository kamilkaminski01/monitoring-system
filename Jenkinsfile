import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def getGitlabConnection() {
    return 'gitlab'
}

def getDeployBranches() {
    return ['master']
}

// return True if current build should be pushed to a registry and deployed
def isDeployBranch() {
    def DEPLOY_BRANCHES = getDeployBranches()
    echo 'Checking if branch: ' + env.BRANCH_NAME + ' is one of: ' + DEPLOY_BRANCHES
    return DEPLOY_BRANCHES.contains(env.BRANCH_NAME)
}

def getImagesRepository() {
    return env.REGISTRY_USER + '/' + env.JOB_BASE_NAME
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
        updateGitlabCommitStatus name: STAGE_NAME, state: 'running'
        try {
            sh 'make build'
            updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
        } catch (exc) {
            onError(STAGE_NAME)
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
            updateGitlabCommitStatus name: STAGE_NAME, state: 'running'
            try {
                sh 'make pytest'
                updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
            } catch (exc) {
                onError(STAGE_NAME)
                throw exc
            }
        }

        stage('Clean code check') {
            echo 'Running static code checks...'
            updateGitlabCommitStatus name: STAGE_NAME, state: 'running'
            try {
                sh 'make check'
                updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
            } catch (exc) {
                onError(STAGE_NAME)
                throw exc
            }
        }

        sh 'docker compose -f docker-compose.yml stop'
    }

    def IMAGES_REPO = getImagesRepository()

    stage('Docker build') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: STAGE_NAME, state: 'running'
            try {
                sh """docker build -t ${IMAGES_REPO}:backend backend"""
                sh """docker build -t ${IMAGES_REPO}:frontend frontend"""
                updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
            } catch (exc) {
                onError(STAGE_NAME)
                throw exc
            }
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage('Docker push') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: STAGE_NAME, state: 'running'
            try {
                withCredentials([
                    string(credentialsId: 'REGISTRY_PASSWORD', variable: 'REGISTRY_PASSWORD')
                ]) {
                    withEnv([
                        "REGISTRY_USER=${env.REGISTRY_USER}",
                        "IMAGES_REPO=${IMAGES_REPO}"
                    ]) {
                        sh 'echo -n $REGISTRY_PASSWORD | docker login -u $REGISTRY_USER --password-stdin'
                        sh 'docker push $IMAGES_REPO:backend'
                        sh 'docker push $IMAGES_REPO:frontend'
                        sh 'docker logout'
                    }
                }
                updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
            } catch (exc) {
                onError(STAGE_NAME)
                throw exc
            }
        } else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage('Deploy') {
        if (SHOULD_DEPLOY) {
            updateGitlabCommitStatus name: STAGE_NAME, state: 'running'
            try {
                withCredentials([
                    string(credentialsId: 'REGISTRY_PASSWORD', variable: 'REGISTRY_PASSWORD'),
                    string(credentialsId: 'SSH_USER', variable: 'SSH_USER'),
                    string(credentialsId: 'SSH_HOST', variable: 'SSH_HOST')
                ]) {
                    withEnv([
                        "REGISTRY_USER=${env.REGISTRY_USER}",
                        "IMAGES_REPO=${IMAGES_REPO}",
                        "PROJECT=${env.JOB_BASE_NAME}"
                    ]) {
                        sh '''
                            ssh $SSH_USER@$SSH_HOST "
                            cd $PROJECT/ &&
                            echo -n $REGISTRY_PASSWORD | docker login -u $REGISTRY_USER --password-stdin &&
                            make down env=prod &&
                            docker images -q $IMAGES_REPO | xargs -r docker rmi &&
                            make run env=prod"
                        '''
                    }
                }
                updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
            } catch (exc) {
                onError(STAGE_NAME)
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
