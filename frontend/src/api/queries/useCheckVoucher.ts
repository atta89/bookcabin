import type { AxiosError } from "axios";
import axios from "axios";
import { useState } from "react";
import type { CheckVoucherRequest, CheckVoucherResponse } from "../types";

const useCheckVoucher = () => {
  const [data, setData] = useState<CheckVoucherResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<Error>>();

  async function check(
    input: CheckVoucherRequest
  ): Promise<CheckVoucherResponse> {
    setLoading(true);
    try {
      const { data: result } = await axios.post("/check", input);
      setData(result);
      return result;
    } catch (err) {
      const errors = err as AxiosError<Error>;
      setError(errors);
      throw errors;
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    check,
  };
};

export default useCheckVoucher;
