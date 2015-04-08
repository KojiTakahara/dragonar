package dragonar

import (
	"strconv"
)

func ToInt(v string) int {
	if v == "-" {
		return -1
	}
	i, _ := strconv.Atoi(v)
	return i
}
