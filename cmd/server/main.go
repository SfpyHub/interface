package main

import (
	"flag"
	"os"

	"interface/pkg/server"
	"interface/pkg/utils"

	"github.com/go-kit/kit/log"
	"github.com/go-kit/kit/log/level"
)

const (
	envIndexFile          string = "INDEX_FILE"
	defaultIndexFile      string = "index.html"
	envStaticDir          string = "STATIC_DIR"
	defaultStaticDir      string = "static/"
	envAppEnvironment     string = "APP_ENVIRONMENT"
	defaultAppEnvironment string = "local"
)

// Variables set during compile via -X options
var (
	Version string
	Build   string
	GitHash string
)

func main() {
	var (
		logLevel    = flag.String("log.level", "info", "Logging Level: [debug | info | warn | error]")
		logFormat   = flag.String("log.format", "json", "Logging Format: [text | json]")
		httpCmdAddr = flag.String("http.cmd.addr", ":3456", "Command, Debug, and Metrics listen Address")
	)

	flag.Parse()

	// Set log level
	var levelFilter level.Option
	switch *logLevel {
	case "debug":
		levelFilter = level.AllowDebug()
	case "info":
		levelFilter = level.AllowInfo()
	case "warn":
		levelFilter = level.AllowWarn()
	case "error":
		levelFilter = level.AllowError()
	default:
		panic("no valid LOG_LEVEL set")
	}

	var logger log.Logger
	logger = level.NewFilter(logger, levelFilter)
	logger = log.With(logger, "ts", log.DefaultTimestampUTC, "caller", log.DefaultCaller)
	switch *logFormat {
	case "text":
		logger = log.NewLogfmtLogger(log.NewSyncWriter(os.Stderr))
	case "json":
		logger = log.NewJSONLogger(log.NewSyncWriter(os.Stderr))
	default:
		logger = log.NewJSONLogger(log.NewSyncWriter(os.Stderr))
	}
	// logging version
	logger.Log("Version", Version)
	logger.Log("Build", Build)
	logger.Log("Git Hash", GitHash)

	// logging flags
	logger.Log("log.level", *logLevel)
	logger.Log("log.format", *logFormat)
	logger.Log("http.cmd.addr", *httpCmdAddr)

	indexFile := utils.EnvString(envIndexFile, defaultIndexFile)
	staticDir := utils.EnvString(envStaticDir, defaultStaticDir)
	appEnv := utils.EnvString(envAppEnvironment, defaultAppEnvironment)

	config := server.ServerConfig{
		AppEnv:      appEnv,
		HttpCmdAddr: *httpCmdAddr,
		IndexFile:   indexFile,
		StaticDir:   staticDir,
	}

	srv, err := server.NewServer(config, logger)
	if err != nil {
		level.Error(logger).Log("err", "err")
		panic(err)
	}

	// run server
	err = srv.Run()
	logger.Log("err", err)
	logger.Log("exiting")
}
