.PHONY: show-help
help: show-help

VERSION=0.0.1
BUILD=`date +%FT%T%z`
GIT_HASH=`git rev-parse HEAD`

EXEC_SERVER=server

BUILD_DIR=build
BUILD_CMD_DIR=$(BUILD_DIR)/cmd

CMD_MKDIR=mkdir -p
CMD_RM=rm -rf
CMD_GO=go
CMD_CD=cd

LDFLAGS=-ldflags "-X main.Version=$(VERSION) -X main.Build=$(BUILD) -X main.GitHash=$(GIT_HASH)"

###
### run targets
###
.PHONY: run-%
run-%:
	$(CMD_GO) run -v $(LDFLAGS) cmd/$*/main.go -log.level=debug -log.format=text

##
## build targets
##
.PHONY: build
build: build-$(EXEC_SERVER)

build-%: directories
	$(CMD_GO) build -v -o $(BUILD_CMD_DIR)/$* $(LDFLAGS) cmd/$*/main.go

##
## misc targets
##
.PHONY: directories
directories:
	$(CMD_MKDIR) $(BUILD_CMD_DIR)

.PHONY: clean
clean:
	$(CMD_RM) $(BUILD_DIR)

##
## help
##
.PHONY: show-help
show-help:
	@echo "============================================================================================="
	@echo " targets:"
	@echo "   build:       build all executables"
	@echo "   clean:       remove 'build' directory"
	@echo "   "
	@echo "   run-server:  run the server"
	@echo "============================================================================================="
