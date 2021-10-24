# instructor-repo
10/13/2021 - This is a mostly stripped down version of the final project intended to be given to students at the start of iteration 2.

## Envirnment Configuration
All the environment configuration settings are stored in [config/settings](config/settings).
 * ```DOCKER_IMAGE_PREFIX``` is the docker image repository.
 * ```DEP_DIR``` is the dependency build directory for both CSE Labs and the docker image.

These settings should change every semeseter.

## Setting up Dependencies and the Development Environment
All the dependencies are stored in the [env](env) folder.  This folder is precompiled on the CSE Labs and the Docker image.

#### Updating CSE Labs Environment
```bash
cd env
./setup.sh
```

#### Updating the Docker Base Image
```bash
./bin/build-base.sh
```

#### Building the Docker Development Environent
```bash
./bin/build-env.sh
```

#### Running the project
```bash
./bin/run-env.sh
cd project
make -j

# Run the basic scene
./bin/run.sh

# Run any scene
./bin/run.sh scenes/umn.json
```
* Navigate to http://127.0.0.1:8081

#### Debugging the Environment
```bash
# Run the development environment
./bin/run-env.sh

# Edit and reinstall the entity project
cd env/EntityProject
make install -j

# Test the project
cd ../../project
make -j
./bin/run.sh
```

#### Using the SSH Environment on CSE Labs
```bash
# Run the ssh environment
# Example: ./bin/ssh-env.sh <x500> <port> <computer num>
./bin/ssh-env.sh myx500 8081 05

cd /path/to/project
make -j
./bin/run.sh
```

* Navigate to http://127.0.0.1:8081

#### Using VOLE Environment
```bash
cd /path/to/project
make -j
./bin/run.sh
```

* Navigate to http://127.0.0.1:8081 on VOLE (better performance with VOLE-3D)
