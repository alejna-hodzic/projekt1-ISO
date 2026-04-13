package config

import "os"

type Configuration struct {
	MySQL MySqlConf
}

type MySqlConf struct {
	Address  string
	Port     string
	User     string
	Password string
	Database string
}

func LoadConfig() *Configuration {
	return &Configuration{
		MySQL: MySqlConf{
			Address:  os.Getenv("DB_HOST"),
			Port:     os.Getenv("DB_PORT"), 
			User:     os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			Database: os.Getenv("DB_NAME"), 
		},
	}
}