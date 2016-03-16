package dragonar

import (
	"time"
)

type Deck struct {
	Player       string
	Format       string
	MainDeck     []string
	MainColors   []string
	HyperSpatial []string
	HyperColors  []string
    Time         time.Time
}
