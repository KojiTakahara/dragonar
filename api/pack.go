package api

import (
	"net/http"
	"strings"

	"github.com/KojiTakahara/dragonar/model"
	"github.com/labstack/echo"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

func FindPack(c echo.Context) error {
	ctx := appengine.NewContext(c.Request())
	packs := []model.Pack{}
	q := datastore.NewQuery("Pack")
	q.GetAll(ctx, &packs)
	return c.JSON(http.StatusOK, packs)
}

func CreatePack(c echo.Context) error {
	ctx := appengine.NewContext(c.Request())
	names := []string{}
	if 0 < len(c.FormValue("names")) {
		names = strings.Split(c.FormValue("names"), "|")
	}
	if 0 < len(c.FormValue("name")) {
		names = append(names, c.FormValue("name"))
	}

	for i := range names {
		name := names[i]
		model := &model.Pack{
			Name: name,
		}
		key := datastore.NewKey(ctx, "Pack", name, 0, nil)
		datastore.Put(ctx, key, model)
	}
	return c.JSON(http.StatusOK, "")
}
