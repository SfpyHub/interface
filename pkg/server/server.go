package server

import (
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/go-kit/kit/log"
)

type ServerConfig struct {
	AppEnv      string
	HttpCmdAddr string
	IndexFile   string
	StaticDir   string
}

type server struct {
	logger     log.Logger
	transports []RunCloser
}

// NewServer creates a new demand server
func NewServer(config ServerConfig, logger log.Logger) (*server, error) {
	logger = log.With(logger, "module", "Server")

	command, err := NewHTTPTransport(config, logger)
	if err != nil {
		return nil, err
	}

	return &server{
		logger:     logger,
		transports: []RunCloser{command},
	}, nil
}

// Run
//
func (s *server) Run() error {
	//l := s.logger.WithField("function", "Run")

	// Interrupt handler.
	errc := make(chan error)
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errc <- fmt.Errorf("%s", <-c)
	}()

	// run all defined transport
	for _, v := range s.transports {
		go func(r Runner) {
			errc <- r.Run()
		}(v)
	}

	// wait for event
	var err = <-errc

	// Cleanup
	s.Close()

	return err
}

// Close
//
func (s *server) Close() error {
	l := log.With(s.logger, "function", "Close")

	// Close all transports
	var wg sync.WaitGroup
	for _, v := range s.transports {
		wg.Add(1)
		go func(c Closer) {
			defer wg.Done()
			if err := c.Close(); err != nil {
				l.Log("err", err).Error()
			}
		}(v)
	}

	// wait until all closers are done then notify channel
	errc := make(chan bool)
	go func() {
		wg.Wait()
		errc <- true
	}()

	// wait untill all closers are done or timeout
	select {
	case <-errc:
		break
	case <-time.After(10 * time.Second):
		l.Log("Timeout reached")
	}

	return nil
}
