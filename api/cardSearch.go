package api

import (
	"strings"
	"bytes"
	"net/url"
	"net/http"

	"github.com/PuerkitoBio/goquery"
	"github.com/labstack/echo"
	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

const(
	PACK_1 = "ex04|rp08|ex03|rp07|ex02|rp06|rp05|rp04m|rp04s|ex01|rp03|sp01|rp02|rp01|x26|x25|r23|x24|r22|x23|r21|r20|x22|r19|x21|r18|x20|r17|x19|r16s|r16g|r15|x18|r14|x17|r13|x16|r12|r11|x15|r10|r09|x14|r08s|x12|r08|x13|r07|x11|r06|r05|x08|r04|x07|x06|r03|x05|x04|r02|r01|x01|39|c68|c67|38|c66|37|c64|36|c61|35|34+1s|34|c55|33|32|c54|c53|c52|c51|31|c48|c47|30|29+1d|29|28|c42|27+1d|27|26|25|24|c34|23|22|21|20|19|18|c27|17|16|15|14|13|12|11|10|9|8|7|6|5|4|3|2|1"
	PACK_2 = "sd09|sd08|bd08|bd07|sd07|bd06|bd05|sd06|sd05|sd04|si|bd04|bd03|bd02|bd01|sd03|sd02|sd01|d35|d34|d33|d32|d31|d30|d29|d28|d27|d26|d25|d24|d23|d22|d21|d20|d18|d19|d15|d16|d17|d14|d13|d12|d11|d10|d09|d08|d07|x10|x09|d06|d05|d04|d03|x03|x02|d02|d01|c65|c63|c62|c60|c59|c58|c57|c56|c50|c49|c46|c45|c44|c43|c41|c40|c39|c38|c37|c36|corocoroy18|corocoroy17|corocoroy16|corocoroy15|corocoroy14|promoy17|promoy16|promoy15|promoy14|promoy13|promoy12|promoy11|promoy10|promoy9|promoy8|promoy7|promoy6|promoy5|promoy4|promoy3|promoy2|promoy1"
)

func Search(c echo.Context) error {
	ctx := appengine.NewContext(c.Request())
	client := urlfetch.Client(ctx)
	urlStr := "https://dm.takaratomy.co.jp/card/search/"
	contentType := "application/x-www-form-urlencoded"
	form := url.Values{}
	form.Add("keyword_name", "1")
	form.Add("keyword", c.FormValue("keyword"))
	form.Add("packlist_1[]", PACK_1)
	form.Add("packlist_2[]", PACK_2)

	cards := []string{}
	resp, _ := client.Post(urlStr, contentType, bytes.NewBufferString(form.Encode()))
	doc, _ := goquery.NewDocumentFromResponse(resp)
	doc.Find(".card-title").Each(func(_ int, s *goquery.Selection) {
		cards = append(cards, getCardName(s.Text()))
	})
	return c.JSON(http.StatusOK, removeDuplicates(cards))
}

func getCardName(name string) string {
	trim := strings.TrimLeft(name, "\n")
	return strings.Split(trim, "(")[0]
}

func removeDuplicates(list []string) []string {
	m := make(map[string]bool)
	result := []string{}
	for _, element := range list {
		if !m[element] {
			m[element] = true
			result = append(result, element)
		}
	}
	return result
}
