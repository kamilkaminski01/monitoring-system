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

    def SHOULD_DEPLOY = isDeployBranch()
    if (SHOULD_DEPLOY) {
        echo 'Performing deployment'
        stage('Build') {
            echo 'Building...'
            sh 'make build env=prod'
        }

        // Need to be sure that other builds are for example not using
        // same ports - that is why those stages have to be locked
        // and just after services have to be stopped
        lock("docker_compose_run") {
            stage('Tests') {
                echo 'Testing...'
                sh 'make test'
            }

            stage('Clean code check') {
                echo 'Running static code checks...'
                sh 'make check'
            }

            sh 'docker compose -f docker-compose.yml stop'
        }
    } else {
        echo 'Running tests with no deployment'
        stage('Build') {
            echo 'Building...'
            sh 'make build'
        }
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
    } catch (exc) {
        onError()
        throw exc
    } finally {
        onFinal()
    }
}
