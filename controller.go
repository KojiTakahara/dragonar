package dragonar

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"net/http"
	"strconv"
)

func CreateDeckSheet(r render.Render, params martini.Params, w http.ResponseWriter, req *http.Request) {
	id, _ := strconv.Atoi(params["id"])
	var deck = GetDeckByVault(id, req)
	if deck.HyperSpatial == nil || deck.MainDeck == nil {
		r.JSON(400, "badRequest")
	} else {
		r.JSON(200, deck)
	}
}
