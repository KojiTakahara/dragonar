package api

import (
	"bytes"
	"context"
	"net/http"
	"net/url"
	"strings"

	"github.com/KojiTakahara/dragonar/model"
	"github.com/PuerkitoBio/goquery"
	"github.com/labstack/echo"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/urlfetch"
)

type Card struct {
	Name string
	Type string
}

func Search(c echo.Context) error {
	ctx := appengine.NewContext(c.Request())
	client := urlfetch.Client(ctx)
	urlStr := "https://dm.takaratomy.co.jp/library/card/search/"
	contentType := "application/x-www-form-urlencoded"
	form := url.Values{}
	form.Add("keyword_name", "1")
	form.Add("keyword", c.FormValue("keyword"))
	form.Add("packlist_1[]", getPacks(ctx))

	cards := []*Card{}
	resp, _ := client.Post(urlStr, contentType, bytes.NewBufferString(form.Encode()))
	doc, _ := goquery.NewDocumentFromResponse(resp)
	doc.Find(".cardDeatailContainer").Each(func(_ int, s *goquery.Selection) {
		card := &Card{
			Name: getCardName(s.Find(".card-title").Text()),
			Type: getCardType(s.Find(".card-cost").Text()),
		}
		cards = append(cards, card)
	})
	return c.JSON(http.StatusOK, removeDuplicates(cards))
}

func getPacks(ctx context.Context) string {
	packs := []model.Pack{}
	q := datastore.NewQuery("Pack")
	q.GetAll(ctx, &packs)
	var sb strings.Builder
	for _, pack := range packs {
		sb.WriteString(pack.Name + "|")
	}
	return sb.String()
}

func getCardName(name string) string {
	trim := strings.TrimLeft(name, "\n")
	return strings.Split(trim, "(")[0]
}

func getCardType(s string) string {
	return strings.Split(s, "種類：")[1]
}

func removeDuplicates(list []*Card) []*Card {
	m := make(map[string]bool)
	result := []*Card{}
	for _, element := range list {
		if !m[element.Name] {
			m[element.Name] = true
			result = append(result, element)
		}
	}
	return result
}
