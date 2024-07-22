def getDeployBranches() {
    return ['master']
}

// return True if current build should be pushed to Harbor and deployed
def isDeployBranch() {
    def DEPLOY_BRANCHES = getDeployBranches()
    echo 'Checking if branch: ' + env.BRANCH_NAME + ' is one of: ' + DEPLOY_BRANCHES
    return DEPLOY_BRANCHES.contains(env.BRANCH_NAME)
}

def onBuild() {
    properties([gitLabConnection('gitlab')])

    echo 'Build for branch: ' + env.BRANCH_NAME

    stage('Checkout repository') {
        checkout scm
    }

    stage('Build') {
        echo 'Building...'
        updateGitlabCommitStatus name: 'Build', state: 'pending'
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
            updateGitlabCommitStatus name: 'Tests', state: 'pending'
            sh 'make pytest'
            updateGitlabCommitStatus name: 'Tests', state: 'success'
        }

        stage('Clean code check') {
            echo 'Running static code checks...'
            updateGitlabCommitStatus name: 'Clean code check', state: 'pending'
            sh 'make check'
            updateGitlabCommitStatus name: 'Clean code check', state: 'success'
        }

        sh 'docker compose -f docker-compose.yml stop'
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
