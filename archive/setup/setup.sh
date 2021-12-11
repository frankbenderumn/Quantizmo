#!/bin/bash
ROOTDIR=`git rev-parse --show-toplevel`
source ${ROOTDIR}/config/settings


src_dir=/export/scratch/csci3081/src
install_dir=${DEP_DIR}

echo ${install_dir}

CC=gcc
CXX=g++

#rm -rf ${src_dir}
rm -rf ${install_dir}
mkdir -p ${src_dir}
mkdir -p ${install_dir}

if [ -f "/usr/bin/g++" ]; then
	echo CC=/usr/bin/gcc >> ${install_dir}/env
	echo CXX=/usr/bin/g++ >> ${install_dir}/env
	echo OPENCV_LIBS=`pkg-config --libs opencv4` >> ${install_dir}/env
	echo OPENCV_INCLUDES=`pkg-config --cflags opencv4` >> ${install_dir}/env
        CC=/usr/bin/gcc
        CXX=/usr/bin/g++
	mkdir ${src_dir}/config
	echo DEP_DIR=${DEP_DIR} >> ${src_dir}/config/settings
fi

cd ${src_dir}
git init .
git clone https://github.com/dtorban/CppWebServer.git CppWebServer 
mkdir -p ${src_dir}/CppWebServer/build
git clone https://github.com/google/googletest.git gtest
mkdir -p ${src_dir}/gtest/build
cd ${src_dir}/CppWebServer/build
cmake -DCMAKE_C_COMPILER=${CC} -DCMAKE_CXX_COMPILER=${CXX} -DCMAKE_INSTALL_PREFIX=${install_dir} ..
make install -j
cd ${src_dir}/gtest/build
cmake -DCMAKE_C_COMPILER=${CC} -DCMAKE_CXX_COMPILER=${CXX} -DCMAKE_INSTALL_PREFIX=${install_dir} ..
make install -j

find ${install_dir} -type d -exec chmod 775 {} \;
find ${install_dir} -type f -exec chmod 664 {} \;

rm -rf ${src_dir}