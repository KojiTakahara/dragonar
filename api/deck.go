package api

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/KojiTakahara/dragonar/model"
	"github.com/labstack/echo"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

func GetDeckByPlayer(c echo.Context) error {
	ctx := appengine.NewContext(c.Request())
	name := c.QueryParam("name")
	decks := []model.Deck{}
	q := datastore.NewQuery("Player")
	_, err := q.Filter("Player>=", name).Filter("Player<", name+"\ufffd").GetAll(ctx, &decks)
	if err != nil {
		log.Infof(ctx, "%s", err)
	}
	if len(decks) != 0 {
		log.Infof(ctx, "message")
	}
	return c.JSON(http.StatusOK, decks)
}

func CreateDeck(c echo.Context) error {
	ctx := appengine.NewContext(c.Request())
	forbidden, _ := strconv.ParseBool(c.FormValue("forbiddenStar"))
	model := &model.Deck{
		Player:        c.FormValue("name"),
		DmpId:         c.FormValue("id"),
		Format:        c.FormValue("format"),
		MainDeck:      strings.Split(c.FormValue("mainDeck"), ","),
		HyperSpatial:  strings.Split(c.FormValue("hyperSpatial"), ","),
		HyperGR:       strings.Split(c.FormValue("hyperGR"), ","),
		ForbiddenStar: forbidden,
		Time:          time.Now(),
	}
	key := datastore.NewKey(ctx, "Deck", "", 0, nil)
	datastore.Put(ctx, key, model)
	return c.JSON(http.StatusOK, "")
}
