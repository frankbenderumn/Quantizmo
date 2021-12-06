CUR_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

ROOT_DIR := $(shell git rev-parse --show-toplevel)
-include $(ROOT_DIR)/config/settings
BUILD_DIR=${ROOT_DIR}-build
CXX = g++
CXXFLAGS = -std=c++11 -g -fPIC $(ITERATION_DEFINES)

INCLUDES = -I.. -I$(DEP_DIR)/include -Isrc -I. -I$(DEP_DIR)/include -Iinclude -I. -Icurl -Ipqxx -Iyaml-cpp
LIBDIRS = -L$(DEP_DIR)/lib 
LIBS = -lpthread -lcurl -lpqxx -lyaml-cpp

SOURCES = $(wildcard src/*.cc) $(wildcard src/*/*.cc) $(wildcard src/*.cpp) $(wildcard src/*/*.cpp)

OBJFILES_CC = $(notdir $(SOURCES:.cc=.o))
OBJFILES = $(notdir $(OBJFILES_CC:.cpp=.o))
OBJDIR = $(BUILD_DIR)/obj
OBJECTS = $(addprefix $(OBJDIR)/, $(OBJFILES))
-include $(DEP_DIR)/env

LIBFILE = ${BUILD_DIR}/lib/libcsci3081proj.so
EXEFILE = ${BUILD_DIR}/bin/web-app

all: $(EXEFILE)

# Compile source files
$(OBJDIR)/%.o: src/%.cc
	$(call make-depend-cxx,$<,$@,$(subst .o,.d,$@))
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# Compile source files -- added for cpp files
$(OBJDIR)/%.o: src/%.cpp
	$(call make-depend-cxx,$<,$@,$(subst .o,.d,$@))
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# Compile source files -- added for cpp files
$(OBJDIR)/%.o: src/*/%.cpp
	$(call make-depend-cxx,$<,$@,$(subst .o,.d,$@))
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# Compile source files
$(OBJDIR)/%.o: src/config/%.cc
	$(call make-depend-cxx,$<,$@,$(subst .o,.d,$@))
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# Generate dependencies
make-depend-cxx=$(CXX) -MM -MF $3 -MP -MT $2 $(CXXFLAGS) $(INCLUDES) $1
-include $(addprefix $(OBJDIR)/,$(OBJFILES:.o=.d))

# Build shared library
$(LIBFILE): $(BUILD_DIR) $(OBJECTS)
	$(CXX) $(CXXFLAGS) -shared $(INCLUDES) $(LIBDIRS) $(LIBS) $(OBJECTS) -o $@

data-files:
	mkdir -p $(ROOT_DIR)/.dependencies
	rsync -au $(DEP_DIR)/include $(ROOT_DIR)/.dependencies/

# Build web viewer
#add data-files to end
$(EXEFILE): $(BUILD_DIR) $(LIBFILE) data-files
	$(CXX) $(CXXFLAGS) -Wl,-rpath,$(BUILD_DIR)/lib $(INCLUDES) $(LIBDIRS) -L$(BUILD_DIR)/lib src/main.cc -lcsci3081proj $(LIBS) -lCppWebServer -lwebsockets -lssl -lcrypto -lz -o $@ 

# Build tests
test: $(LIBFILE)
	cd tests; make

# Make build directory
$(BUILD_DIR):
	mkdir -p ${BUILD_DIR}/obj
	mkdir -p ${BUILD_DIR}/lib
	mkdir -p ${BUILD_DIR}/bin

clean-data:
	rm -rf web/models
	rm -rf web/textures
	rm -rf web/data

# Clean build directory
clean:
	rm -rf ${BUILD_DIR}