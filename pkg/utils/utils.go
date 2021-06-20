package utils

import (
	"fmt"
	"os"

	"strconv"
)

func EnvString(env, fallback string) string {
	e := os.Getenv(env)
	if e == "" {
		return fallback
	}
	return e
}

func EnvBool(env string, fallback bool) bool {
	v, err := GetBool(env)
	if err != nil {
		return fallback
	}
	return v
}

func EnvInt(env string, fallback int) int {
	e := os.Getenv(env)
	if e == "" {
		return fallback
	}
	i, err := strconv.Atoi(e)
	if err != nil {
		return fallback
	}
	return i
}

func GetBool(key string) (bool, error) {
	value := os.Getenv(key)
	if value == "" {
		return false, fmt.Errorf("no value defined for '%s", key)
	}
	b, err := strconv.ParseBool(value)
	if err != nil {
		return false, fmt.Errorf("'%s'='%s' resulted in error: %s", key, value, err)
	}

	return b, nil
}

func SetEnv(env, value string) {
	e := os.Getenv(env)
	if e == "" {
		os.Setenv(env, value)
	}
}
