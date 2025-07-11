package models

type Aircrafts struct {
	Aircrafts []Aircraft `json:"aircrafts"`
}

type Aircraft struct {
	AircraftType string   `json:"aircraft_type"`
	Rows         int      `json:"rows"`
	SeatsPerRow  []string `json:"seats_per_row"`
}
