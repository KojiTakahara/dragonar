package api

import (
	"bytes"
	"context"
	"net/http"
	"net/url"
	"strings"
	"sync"

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
	urlStr := "https://dm.takaratomy.co.jp"
	contentType := "application/x-www-form-urlencoded"
	form := url.Values{}
	form.Add("keyword", c.FormValue("keyword"))

	cards := []*Card{}
	resp, _ := client.Post(urlStr+"/card/", contentType, bytes.NewBufferString(form.Encode()))
	doc, _ := goquery.NewDocumentFromResponse(resp)

	// var mutex = &sync.Mutex{}
	var wg sync.WaitGroup

	doc.Find("#cardlist > ul > li").Each(func(index int, s *goquery.Selection) {
		cardUrl, _ := s.Find("a").Attr("data-href")
		wg.Add(1)
		go func(url string) {
			// mutex.Lock()
			res, _ := client.Get(urlStr + url)
			d, _ := goquery.NewDocumentFromResponse(res)
			card := &Card{
				Name: getCardName(d),
				Type: getCardType(d),
			}
			cards = append(cards, card)
			// mutex.Unlock()
			wg.Done()
		}(cardUrl)
	})
	wg.Wait()
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

func getCardName(doc *goquery.Document) string {
	name := ""
	doc.Find(".cardname").Each(func(index int, s *goquery.Selection) {
		if index == 0 {
			name = s.Text()
		}
	})
	trim := strings.TrimLeft(name, "\n")
	return strings.Split(trim, "(")[0]
}

func getCardType(doc *goquery.Document) string {
	t := ""
	doc.Find(".typetxt").Each(func(index int, s *goquery.Selection) {
		if index == 0 {
			t = s.Text()
		}
	})
	return strings.Split(t, "(")[0]
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
