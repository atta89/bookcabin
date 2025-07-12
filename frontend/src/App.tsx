import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Layout } from "./components";
import { DatePicker } from "@mui/x-date-pickers";
import { AIRCRAFT_TYPE } from "./constants";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import {
  useCheckVoucher,
  useGenerateVoucher,
  useGetVoucher,
  type GenerateVoucherRequest,
} from "./api";
import dayjs from "dayjs";
import type { AxiosError } from "axios";

function App() {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { check } = useCheckVoucher();
  const { generate } = useGenerateVoucher();
  const { data, getVoucher } = useGetVoucher();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleModal = () => {
    setOpen((prev) => !prev);
  };

  const { values, errors, setValues, setErrors, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        crew_name: "",
        crew_id: "",
        aircraft_type: "",
        flight_number: "",
        flight_date: dayjs().format("YYYY-MM-DD"),
      } as GenerateVoucherRequest,
      onSubmit: async (values) => {
        await check({
          flight_date: values.flight_date,
          flight_number: values.flight_number,
        })
          .then(async ({ exist }) => {
            if (exist) {
              enqueueSnackbar("Voucher already exists", { variant: "error" });
              setErrors({
                flight_number: "Voucher already exists with same flight number",
                flight_date: "Voucher already exists with same flight date",
              });
            } else {
              await generate(values)
                .then(() => {
                  getVoucher();
                  handleModal();
                  enqueueSnackbar("Voucher generated successfully", {
                    variant: "success",
                  });
                })
                .catch((err: AxiosError) => {
                  enqueueSnackbar(
                    `Failed to generate voucher: ${err.response?.data}`,
                    {
                      variant: "error",
                    }
                  );
                });
            }
          })
          .catch((err: AxiosError) => {
            enqueueSnackbar(`Failed to check voucher: ${err.response?.data}`, {
              variant: "error",
            });
          });
      },
    });

  useEffect(() => {
    getVoucher();
  }, [getVoucher]);

  return (
    <Layout>
      <Box p={3}>
        <Stack
          pb={2}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>Manage Voucher</Typography>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Add />}
            sx={{ borderColor: "GrayText", textTransform: "none" }}
            onClick={handleModal}
          >
            Add Voucher
          </Button>
        </Stack>
        <Divider />
        <Box
          mt={2}
          sx={{
            gap: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {data?.map((voucher) => (
            <Box
              p={2}
              key={voucher.id}
              borderRadius={2}
              color="white"
              bgcolor={(theme) => theme.palette.info.main}
            >
              <Typography>
                {voucher.crew_name} #{voucher.crew_id}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {voucher.aircraft_type}{" "}
                <Typography component="span">
                  {voucher.flight_number}
                </Typography>
              </Typography>
              <Divider sx={{ my: 1, bgcolor: "white" }} />
              <Box
                mx={-3}
                mt={-2}
                display="flex"
                gap={1}
                justifyContent="space-between"
              >
                <Box p={1} bgcolor="white" borderRadius="50%" />
                <Box p={1} bgcolor="white" borderRadius="50%" />
              </Box>
              <Box display="flex" gap={1} justifyContent="space-between">
                <Typography>{voucher.flight_date}</Typography>
                <Typography>{voucher.seats}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        {data?.length === 0 && (
          <Box
            mt={2}
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="text.disabled"
          >
            <Typography variant="body2">No vouchers found</Typography>
          </Box>
        )}
      </Box>
      <Dialog
        fullWidth
        open={open}
        maxWidth="sm"
        fullScreen={fullScreen}
        onClose={handleModal}
      >
        <DialogTitle>Voucher Seat Assignment</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <FormControl margin="normal" fullWidth>
              <InputLabel shrink sx={{ background: "white" }}>
                Crew Name
              </InputLabel>
              <TextField
                size="small"
                required
                fullWidth
                name="crew_name"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel shrink sx={{ background: "white" }}>
                Crew ID
              </InputLabel>
              <TextField
                size="small"
                required
                fullWidth
                name="crew_id"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel shrink sx={{ background: "white" }}>
                Flight Number
              </InputLabel>
              <TextField
                size="small"
                required
                fullWidth
                name="flight_number"
                onChange={handleChange}
                error={!!errors.flight_number}
                helperText={errors.flight_number}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel shrink sx={{ background: "white" }}>
                Flight Date
              </InputLabel>
              <DatePicker
                name="flight_date"
                value={dayjs(values.flight_date)}
                onChange={(newValue) =>
                  setValues({
                    ...values,
                    flight_date: newValue?.format("YYYY-MM-DD") || "",
                  })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    required: true,
                    error: !!errors.flight_date,
                    helperText: errors.flight_date,
                  },
                }}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel shrink sx={{ background: "white" }}>
                Aircraft Type
              </InputLabel>
              <Select
                size="small"
                required
                fullWidth
                name="aircraft_type"
                value={values.aircraft_type}
                onChange={handleChange}
              >
                {AIRCRAFT_TYPE.map((type) => (
                  <MenuItem key={type.aircraft_type} value={type.aircraft_type}>
                    {type.aircraft_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
}

export default App;
