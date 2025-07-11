package models

import "time"

type Voucher struct {
	ID           int       `json:"id" gorm:"primaryKey"`
	CrewName     string    `json:"crew_name" gorm:"column:crew_name"`
	CrewId       string    `json:"crew_id" gorm:"column:crew_id"`
	FlightNumber string    `json:"flight_number" gorm:"column:flight_number"`
	FlightDate   string    `json:"flight_date" gorm:"column:flight_date"`
	AircraftType string    `json:"aircraft_type" gorm:"column:aircraft_type"`
	Seats        string    `json:"seats" gorm:"column:seats"`
	CreatedAt    time.Time `json:"created_at" gorm:"column:created_at"`
}

type VoucherRequest struct {
	CrewName     string `json:"crew_name" gorm:"column:crew_name" validate:"required"`
	CrewId       string `json:"crew_id" gorm:"column:crew_id" validate:"required"`
	FlightNumber string `json:"flight_number" gorm:"column:flight_number" validate:"required"`
	FlightDate   string `json:"flight_date" gorm:"column:flight_date" validate:"required"`
	AircraftType string `json:"aircraft_type" gorm:"column:aircraft_type" validate:"required"`
}

type CheckVoucherRequest struct {
	FlightNumber string `json:"flight_number" gorm:"column:flight_number"`
	FlightDate   string `json:"flight_date" gorm:"column:flight_date"`
}
