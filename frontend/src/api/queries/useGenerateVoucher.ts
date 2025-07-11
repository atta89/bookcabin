import type { AxiosError } from "axios";
import axios from "axios";
import { useState } from "react";
import type { GenerateVoucherRequest, GenerateVoucherResponse } from "../types";

const useGenerateVoucher = () => {
  const [data, setData] = useState<GenerateVoucherResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<Error>>();

  async function generate(
    input: GenerateVoucherRequest
  ): Promise<GenerateVoucherResponse> {
    setLoading(true);
    try {
      const { data: result } = await axios.post("/generate", input);
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
    generate,
  };
};

export default useGenerateVoucher;
