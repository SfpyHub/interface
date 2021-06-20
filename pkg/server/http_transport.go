package server

import (
	"html/template"
	"net/http"

	"interface/pkg/config"

	"github.com/go-kit/kit/log"
	"github.com/go-kit/kit/log/level"
	"github.com/gorilla/mux"
	"github.com/unrolled/secure"
)

type httpTransport struct {
	logger log.Logger
	addr   string
	index  string
	static string
	data   *config.Data
	secure *secure.Secure
}

func NewHTTPTransport(cfg ServerConfig, logger log.Logger) (*httpTransport, error) {
	logger = log.With(logger, "module", "httpTransport")
	appCfg := config.NewData(cfg.AppEnv)
	security := secure.New(config.NewSecurityOptions(cfg.AppEnv))

	return &httpTransport{
		logger: logger,
		addr:   cfg.HttpCmdAddr,
		index:  cfg.IndexFile,
		static: cfg.StaticDir,
		data:   appCfg,
		secure: security,
	}, nil
}

func (t *httpTransport) Run() error {
	logger := log.With(t.logger, "function", "Run")

	r := mux.NewRouter()
	r.Use(t.secure.Handler)

	fs := http.FileServer(http.Dir(t.static))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	r.PathPrefix("/").HandlerFunc(t.handleApp)

	logger.Log("Listening", t.addr)

	return http.ListenAndServe(t.addr, accessControl(r))
}

func (t *httpTransport) Close() error {
	return nil
}

// HandleApp ...
func (t *httpTransport) handleApp(w http.ResponseWriter, r *http.Request) {
	tpl, err := template.ParseFiles(t.index)
	if err != nil {
		level.Error(t.logger).Log("message", "error serving app", "err", err.Error())
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	tpl.Execute(w, t.data)
}

func accessControl(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			return
		}

		h.ServeHTTP(w, r)
	})
}
