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
    echo 'Build for branch: ' + env.BRANCH_NAME

    stage('Checkout repository') {
        checkout scm
    }

    stage('Build') {
        echo 'Building...'
        sh 'make build'
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
            sh 'make pytest'
        }

        stage('Clean code check') {
            echo 'Running static code checks...'
            sh 'make check'
        }

        sh 'docker compose -f docker-compose.yml stop'
    }
}

// Run when build fail
def onError() {
    echo 'Build failed'
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
