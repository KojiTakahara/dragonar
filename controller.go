package dragonar

import (
	//"fmt"
	"github.com/go-martini/martini"
	//"github.com/jung-kurt/gofpdf"
	"github.com/martini-contrib/render"
	//"log"
	"net/http"
	//"os"
	"strconv"
)

func CreateDeckSheet(r render.Render, params martini.Params, w http.ResponseWriter, req *http.Request) {
	id, _ := strconv.Atoi(params["id"])
	var deck = GetDeckByVault(id, req)
	if deck.HyperSpatial == nil || deck.MainDeck == nil {
		r.JSON(400, "badRequest")
	} else {
		pdf := GenerateDeckSheet(deck)
		//log.Println(pdf.err)
		//log.Println(docWriter(pdf, 1).buffer)
		w.Header().Set("Content-type", "application/pdf")
		w.Write(pdf.GetBytesPdf())
		r.JSON(200, pdf)
	}
}

// type pdfWriter struct {
// 	pdf *gofpdf.Fpdf
// 	fl  *os.File
// 	idx int
// }

// func docWriter(pdf *gofpdf.Fpdf, idx int) *pdfWriter {
// 	pw := new(pdfWriter)
// 	pw.pdf = pdf
// 	pw.idx = idx
// 	if pdf.Ok() {
// 		var err error
// 		fileStr := fmt.Sprintf("%s/pdf/tutorial%02d.pdf", "static", idx)
// 		log.Println(fileStr)
// 		pw.fl, err = os.Create(fileStr)
// 		if err != nil {
// 			log.Println(err)
// 			pdf.SetErrorf("Error opening output file %s", fileStr)
// 		}
// 	}
// 	return pw
// }
