package dragonar

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"net/http"
)

var m *martini.Martini

func init() {
	m := martini.Classic()
	m.Use(render.Renderer())
	m.Get("/api/deck/:id", CreateDeckSheet)
	http.ListenAndServe(":8080", m)
	http.Handle("/", m)
}
