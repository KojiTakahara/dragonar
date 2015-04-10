package dragonar

import (
	"github.com/signintech/gopdf"
	"github.com/signintech/gopdf/fonts"
	"log"
	"net/http"
)

func GenerateDeckSheet(w http.ResponseWriter) {
	pdf := gopdf.GoPdf{}
	pdf.Start(gopdf.Config{Unit: "pt", PageSize: gopdf.Rect{W: 595.28, H: 841.89}}) //A4
	pdf.AddFont("THSarabunPSK", new(fonts.THSarabun), "THSarabun.z")
	pdf.AddFont("Loma", new(fonts.Loma), "Loma.z")
	pdf.AddPage()
	log.Println(pdf.GetY())
	pdf.Image("static/img/decksheet.jpg", 0, 0, nil)
	pdf.SetFont("THSarabunPSK", "B", 14)
	pdf.Cell(nil, "Hello world  = สวัสดี โลก in thai")
	pdf.Br(44)
	pdf.Cell(nil, "Hello world  = สวัสดี โลก in thai")

	w.Header().Set("Content-type", "application/pdf")
	w.Write(pdf.GetBytesPdf())
}
