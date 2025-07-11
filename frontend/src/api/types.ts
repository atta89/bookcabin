export type CheckVoucherRequest = {
  flight_number: string;
  flight_date: string;
};

export type CheckVoucherResponse = {
  exist: boolean;
};

export type GenerateVoucherRequest = {
  crew_name: string;
  crew_id: string;
  aircraft_type: string;
  flight_number: string;
  flight_date: string;
};

export type GenerateVoucherResponse = {
  success: boolean;
  seats: string[];
};

export type Voucher = {
  id: number;
  crew_name: string;
  crew_id: string;
  aircraft_type: string;
  flight_number: string;
  flight_date: string;
  seats: string[];
  created_at: string;
};
