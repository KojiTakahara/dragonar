package dragonar

type FormDeck struct {
	MainDeck     string `form:"mainDeck"`
	HyperSpatial string `form:"hyperSpatial"`
	Format       string `form:"format"`
	DeckId       string `form:"deckId"`
}
