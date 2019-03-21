package model

import "time"

type Deck struct {
	Player        string
	DmpId         string
	Format        string
	MainDeck      []string
	HyperSpatial  []string
	HyperGR       []string
	ForbiddenStar bool
	Time          time.Time
}
