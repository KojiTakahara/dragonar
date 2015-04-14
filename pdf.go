package dragonar

import (
	//"github.com/jung-kurt/gofpdf"
	"github.com/signintech/gopdf"
	"github.com/signintech/gopdf/fonts"
	"log"
)

func GenerateDeckSheet(deck *Deck) gopdf.GoPdf {

	// pdf := gofpdf.New("P", "mm", "A4", "")
	// pdf.AddPage()
	// pdf.SetFont("Arial", "B", 16)
	// pdf.Cell(40, 10, "Hello World!")
	// log.Println(pdf.state)

	pdf := gopdf.GoPdf{}
	pdf.Start(gopdf.Config{Unit: "pt", PageSize: gopdf.Rect{W: 595.28, H: 841.89}})
	//pdf.AddFont("THSarabunPSK", new(fonts.THSarabun), "THSarabun.z")
	pdf.AddFont("Loma", new(fonts.Loma), "Loma.z")
	pdf.AddPage()
	pdf.Image("static/img/decksheet.jpg", 0, 0, nil)
	pdf.SetFont("Loma", "B", 14)
	for i := range deck.MainDeck {
		log.Println(deck.MainDeck[i])
		// pdf.SetX(float64(10 + (i * 20)))
		pdf.SetY(float64(10 + (i * 20)))
		pdf.Cell(nil, deck.MainDeck[i])
	}
	return pdf
}
