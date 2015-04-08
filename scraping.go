package dragonar

import (
	"appengine"
	"appengine/urlfetch"
	"github.com/PuerkitoBio/goquery"
	"net/http"
	"strconv"
	"strings"
)

func GetDeckByVault(id int, req *http.Request) *Deck {
	deck := &Deck{}

	url := "http://dmvault.ath.cx/deck" + strconv.Itoa(id) + ".html"
	c := appengine.NewContext(req)
	client := urlfetch.Client(c)
	resp, _ := client.Get(url)

	doc, _ := goquery.NewDocumentFromResponse(resp)
	title := doc.Find("#titledescription h1").Text()
	if title == "" {
		c.Warningf("data not found. id: %d", id)
		return deck
	}
	// デッキリスト
	doc.Find("#recipetable2").Each(func(_ int, s *goquery.Selection) {
		s.Find("tr").Each(func(_ int, s *goquery.Selection) {
			var cardName = s.Find("a").Text()
			if cardName != "" {
				var num = s.Find(".num").Text()
				for i := 0; i < ToInt(num); i++ {
					deck.MainDeck = append(deck.MainDeck, cardName)
				}
			}
		})
	})
	// 超次元ゾーン
	doc.Find("#recipetable3").Each(func(_ int, s *goquery.Selection) {
		s.Find("tr").Each(func(_ int, s *goquery.Selection) {
			var cardName = getHyperSpatialCardName(s)
			if cardName != "" {
				var num = s.Find(".num").Text()
				for i := 0; i < ToInt(num); i++ {
					deck.HyperSpatial = append(deck.HyperSpatial, cardName)
				}
			}
		})
	})
	return deck
}

func getHyperSpatialCardName(s *goquery.Selection) string {
	var cardName = ""
	s.Find("a").Each(func(_ int, s *goquery.Selection) {
		if s.Text() != "" {
			var dicid, _ = s.Attr("dicid")
			if strings.Index(dicid, "b") < 0 && strings.Index(dicid, "c") < 0 {
				cardName = s.Text()
			}
		}
	})
	return cardName
}
