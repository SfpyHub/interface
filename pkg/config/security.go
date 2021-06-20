package config

import (
	"strings"

	"github.com/unrolled/secure"
)

func NewSecurityOptions(env string) secure.Options {
	return secure.Options{
		AllowedHostsAreRegex: true,
		HostsProxyHeaders:    []string{"X-Forwarded-Host"},
		SSLRedirect:          true,
		SSLProxyHeaders:      map[string]string{"X-Forwarded-Proto": "https"},
		STSSeconds:           31536000,
		STSIncludeSubdomains: true,
		STSPreload:           true,
		FrameDeny:            true,
		ContentTypeNosniff:   true,
		BrowserXssFilter:     true,
		IsDevelopment:        isLocal(env),
	}
}

func isLocal(env string) bool {
	return strings.ToUpper(env) == "LOCAL"
}
