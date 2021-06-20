package config

type AppConfig struct {
  Environment string  `json:"environment"`
}

type Data struct {
  AppConfig *AppConfig `json:"app_config"`
}

func newAppConfig(env string) *AppConfig {
  return &AppConfig{
    Environment: env,
  }
}

func NewData(env string) *Data {
  appCfg := newAppConfig(env)
  return &Data{
    AppConfig: appCfg,
  }
}
