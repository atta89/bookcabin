package repositories

import "bc_backend/models"

type VoucherRepo interface {
	GetVouchers() (vouchers []models.Voucher, err error)
	CheckVouchers(voucher *models.Voucher) (err error)
	CreateVoucher(voucher *models.Voucher) (err error)
}
