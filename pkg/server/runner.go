package server

type Runner interface {
	Run() error
}

type Closer interface {
	Close() error
}

type RunCloser interface {
	Runner
	Closer
}
