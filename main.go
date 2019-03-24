// +build !appengine,!appenginevm

package main

import (
	"net/http"

	"github.com/KojiTakahara/dragonar/api"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"google.golang.org/appengine"
)

func main() {
	e := echo.New()
	defer e.Close()

	e.Use(middleware.CORS())
	e.Use(middleware.Recover())
	e.Use(middleware.Logger())
	e.Use(middleware.Gzip())
	e.Use(middleware.Static("static/public"))

	http.Handle("/", e)
	g := e.Group("/api/v1")
	g.POST("/card/search", api.Search)
	g.GET("/deck", api.GetDeckByPlayer)
	g.POST("/deck", api.CreateDeck)
	g.GET("/pack", api.FindPack)
	g.POST("/pack", api.CreatePack)

	appengine.Main()
}
