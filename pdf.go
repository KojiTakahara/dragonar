package dragonar

import (
	"github.com/mawicks/PDFiG/pdf"
	"os"
)

func GenerateDeckSheet() {
	f, _, _ := pdf.OpenFile("/img/decksheet.pdf", os.O_RDWR|os.O_CREATE)

	o1 := pdf.NewIndirect()
	indirect1 := f.WriteObject(o1)
	o1.Write(pdf.NewNumeric(3.14))

	indirect2 := f.WriteObject(pdf.NewNumeric(2.718))

	f.WriteObject(pdf.NewName("foo"))

	// Delete the *indirect reference* to the 3.14 numeric
	f.DeleteObject(indirect1)
	f.WriteObject(pdf.NewNumeric(3))

	// Delete the 2.718 numeric object itself
	f.DeleteObject(indirect2)

	p := pdf.NewPageFactory().New(f)
	p.SetParent(indirect1)
	p.SetMediaBox(0, 0, 612, 792)
	p.Finish()

	catalog := pdf.NewDictionary()
	catalog.Add("Type", pdf.NewName("Catalog"))
	f.SetCatalog(catalog)

	f.Close()
}
