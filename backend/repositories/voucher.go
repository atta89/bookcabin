package repositories

import (
	"bc_backend/models"

	"gorm.io/gorm"
)

type voucherRepo struct {
	db *gorm.DB
}

func NewVoucherRepo(db *gorm.DB) *voucherRepo {
	return &voucherRepo{db}
}

func (r *voucherRepo) GetVouchers() (vouchers []models.Voucher, err error) {
	return vouchers, r.db.Find(&vouchers).Error
}

func (r *voucherRepo) CreateVoucher(voucher *models.Voucher) (err error) {
	return r.db.Create(voucher).Error
}

func (r *voucherRepo) CheckVouchers(vouchers *models.Voucher) (err error) {
	return r.db.Where("flight_number = ? AND flight_date = ?", vouchers.FlightNumber, vouchers.FlightDate).First(&vouchers).Error
}
