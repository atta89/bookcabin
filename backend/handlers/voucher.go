package handlers

import (
	"bc_backend/models"
	"bc_backend/repositories"
	"encoding/json"
	"log"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type voucherHandler struct {
	db *gorm.DB
	vr repositories.VoucherRepo
}

func NewVoucherHandler(api fiber.Router, db *gorm.DB, vr repositories.VoucherRepo) {
	handler := voucherHandler{db, vr}

	api.Get("/vouchers", handler.GetVouchers)
	api.Post("/check", handler.CheckVoucher)
	api.Post("/generate", handler.GenerateVoucher)
}

func (v *voucherHandler) GetVouchers(c *fiber.Ctx) error {
	vouchers, err := v.vr.GetVouchers()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(vouchers)
}

func (v *voucherHandler) CheckVoucher(c *fiber.Ctx) error {
	input := new(models.CheckVoucherRequest)

	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(err.Error())
	}

	err := v.vr.CheckVouchers(&models.Voucher{
		FlightNumber: input.FlightNumber,
		FlightDate:   input.FlightDate,
	})

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusOK).JSON(
				fiber.Map{
					"exist": false,
				},
			)
		} else {
			return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
		}
	}

	return c.Status(fiber.StatusOK).JSON(
		fiber.Map{
			"exist": true,
		},
	)
}

func (v *voucherHandler) GenerateVoucher(c *fiber.Ctx) error {
	input := new(models.VoucherRequest)

	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(err.Error())
	}

	validate := validator.New()
	err := validate.Struct(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	aircraftData := getAircraftData()

	seats := generateSeats(aircraftData, *input)

	newVoucher := &models.Voucher{
		CrewName:     input.CrewName,
		CrewId:       input.CrewId,
		FlightNumber: input.FlightNumber,
		FlightDate:   input.FlightDate,
		AircraftType: input.AircraftType,
		Seats:        strings.Join(seats, ", "),
		CreatedAt:    time.Now(),
	}

	if err := v.vr.CreateVoucher(newVoucher); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(
		fiber.Map{
			"success": true,
			"seats":   seats,
		},
	)
}

func getAircraftData() models.Aircrafts {
	data, err := os.ReadFile("storage/aircraft.json")
	if err != nil {
		log.Fatal("Failed to read file:", err)
	}

	// Unmarshal JSON into struct
	var aircraftData models.Aircrafts
	err = json.Unmarshal(data, &aircraftData)
	if err != nil {
		log.Fatal("Error parsing JSON:", err)
	}

	return aircraftData
}

func generateRows(start, end int) []int {
	rows := make([]int, 0, end-start+1)
	for i := start; i <= end; i++ {
		rows = append(rows, i)
	}
	return rows
}

func generateSeats(a models.Aircrafts, input models.VoucherRequest) []string {
	count := 3
	seats := []string{}
	for _, a := range a.Aircrafts {
		if a.AircraftType == input.AircraftType {
			r := rand.New(rand.NewSource(time.Now().UnixNano()))

			seen := map[string]bool{}
			rows := generateRows(1, a.Rows)

			for len(seats) < count {
				row := rows[r.Intn(a.Rows)]
				seat := a.SeatsPerRow[r.Intn(len(a.SeatsPerRow))]
				seatStr := strconv.Itoa(row) + seat
				if !seen[seatStr] {
					seats = append(seats, seatStr)
					seen[seatStr] = true
				}
			}

		}
	}

	return seats
}
