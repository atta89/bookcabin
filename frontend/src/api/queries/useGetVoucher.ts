import type { AxiosError } from "axios";
import axios from "axios";
import { useCallback, useState } from "react";
import type { Voucher } from "../types";

const useGetVoucher = () => {
  const [data, setData] = useState<Voucher[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<Error>>();

  const getVoucher = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result } = await axios.get("/vouchers");
      setData(result);
      return result;
    } catch (err) {
      const errors = err as AxiosError<Error>;
      setError(errors);
      throw errors;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    getVoucher,
  };
};

export default useGetVoucher;
