import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Stack, Typography, Select, SelectChangeEvent, Grid, Card, CardHeader, CardContent, CardActions, Radio, RadioGroup, TextField, InputAdornment, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CustomAccordion from "../../components/custom-accordion.component";
import TicketForm from "../../components/ticket-form.component";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch } from "../../redux/hooks";
import { getApprovers } from "../../redux/apis/approver.api";
import { RootState } from "../../redux/store";
import { dateFormat } from "../../utils/dateFormat";
import { addTicket } from "../../redux/apis/ticket.api";

const ticketSchema = Yup.object().shape({
  title: Yup.string()
    .min(10, "Minimum 10 Symbols")
    .max(200, "Maximum 200 Symbols")
    .required("Title is Required"),
  description: Yup.string()
    .min(10, "Minimum 10 Symbols")
    .max(500, "Maximum 500 Symbols")
    .required("Description is Required"),
  ticketType: Yup.string().required("Type is Required"),
  categoryType: Yup.string().required("Category is Required"),
  priorityType: Yup.string().required("Priority is Required"),
  timelineType: Yup.string().required("Timeline is Required"),
  approver: Yup.string().required("Approver is Required"),
  fromDate: Yup.date().when("timelineType", {
    is: (val: string) => val === "Permanent",
    then: Yup.date().nullable(),
    otherwise: Yup.date()
      .required("From Date is Required")
      .typeError("Please enter a valid date"),
  }),
  toDate: Yup.date().when("timelineType", {
    is: (val: string) => val === "Permanent",
    then: Yup.date().nullable(),
    otherwise: Yup.date().min(Yup.ref('fromDate'), "To date can't be before from date")
      .required("To Date is Required")
      .typeError("Please enter a valid date"),
  }),
});

const initialValues = {
  title: "",
  description: "",
  ticketType: "",
  categoryType: "",
  priorityType: "",
  timelineType: "",
  approver: "",
  fromDate: null,
  toDate: null,
};

interface ChipData {
  key: number;
  label: string;
}

export const Ticket: React.FC = () => {
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' }
  ]);

  const [approver, setApprover] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getApprovers());
  }, [dispatch]);

  const approverList = useSelector((state: RootState) => state.approver.list);

  const formik = useFormik({
    initialValues,
    validationSchema: ticketSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);

      const data = {
        tickets: {
          title: values.title,
          description: values.description,
          ticketType: { id: values.ticketType },
          category: { id: values.categoryType },
          priority: { id: values.priorityType },
          duration: values.timelineType,
          approvedBy: { id: values.approver },
          accessType: "",
          startDate: dateFormat(values.fromDate),
          endDate: dateFormat(values.toDate)
        },
        selectedSoftwares: {
          preApprovedSoftware: []
        },
        images: []
      }

      console.log("data", data);

      dispatch(addTicket(data))
        .unwrap()
        .then((response) => {
          resetForm();
          console.log('response', response)
          toast.success("Ticket added successfully!");
        })
        .catch((error) => {
          formik.setSubmitting(false);
          toast.error(error);
        });

    },
  });

  const resetForm = () => {
    formik.setSubmitting(false);
    formik.resetForm();
    setApprover('');
  }

  useEffect(() => {
    if (formik.values.timelineType === "Permanent") {
      formik.setFieldValue("fromDate", null);
      formik.setFieldValue("toDate", null);
    }
    // eslint-disable-next-line
  }, [formik.values.timelineType]);


  const handleChange = (event: SelectChangeEvent) => {
    setApprover(event.target.value);
    formik.setFieldValue("approver", event.target.value);
  };

  const getApprover = (id: any) => {
    return approverList?.find((approver) => approver.id === id);
  };


  const [checked, setChecked] = React.useState([0]);
  console.log("Checked", checked)

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <>
      <Typography variant="h6" className="p-typography">Create New Ticket</Typography>
      <ToastContainer closeOnClick={true} />

      <form id="ticket_form" onSubmit={formik.handleSubmit}>
        <CustomAccordion index="1" title="Let us know about your ticket">
          <TicketForm formik={formik} />
        </CustomAccordion>

        <CustomAccordion index="2" title="Detailed Information">

          <div className="software-container">
            <Grid container spacing={7} className="grid-container">
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader className="card-header" title="Pre Approved Software" />
                  <TextField
                    fullWidth
                    placeholder="Search"
                    className="search-text-field"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <CardContent className="pre-approved-card-content">
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
                        const labelId = `checkbox-list-label-${value}`;

                        return (
                          <ListItem
                            key={value}
                            secondaryAction={
                              <ListItemText id={labelId} primary={`${value + 1}`} />
                            }
                            disablePadding
                          >
                            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={checked.indexOf(value) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>


                  </CardContent>
                </Card>
                <InputLabel className="selection-label">Selection</InputLabel>
                <div className="chip">
                  {chipData.map((data) => {
                    return (
                      <div key={data.key} className="chip-list">
                        <Chip
                          label={data.label}
                          color="primary"
                          onDelete={handleDelete(data)}
                        />
                      </div>
                    );
                  })}
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader className="card-header" title="Non Pre Approved Software" />
                  <CardContent>
                    <InputLabel className='p-label'>Software</InputLabel>
                    <TextField required fullWidth placeholder="Enter Software Name" {...formik.getFieldProps('title')} />

                    <InputLabel className='p-label mt-25'>What is the type of software?</InputLabel>
                    <RadioGroup row {...formik.getFieldProps('ticketType')}>
                      <FormControlLabel value="1" control={<Radio />} label="License" className='radio-label' />
                      <FormControlLabel value="2" control={<Radio />} label="Open Source" className='radio-label' />
                    </RadioGroup>

                    <InputLabel className='p-label mt-25'>Who is the license provider?</InputLabel>
                    <RadioGroup row {...formik.getFieldProps('ticketType')}>
                      <FormControlLabel value="1" control={<Radio />} label="Afour Technologies" className='radio-label' />
                      <FormControlLabel value="2" control={<Radio />} label="Client" className='radio-label' />
                    </RadioGroup>

                  </CardContent>
                  <CardActions>
                    <Stack spacing={2} direction="row" className="p-btn non-software-btn" >
                      <Button type="reset" className="clear-btn" variant="text" disabled onClick={e => resetForm()} >
                        Clear
                      </Button>
                      <Button type="submit" className="submit-btn" variant="contained" disabled>Add</Button>
                    </Stack>
                  </CardActions>
                </Card>

                <InputLabel className="selection-label">Selection</InputLabel>
                <div className="chip">
                  {chipData.map((data) => {
                    return (
                      <div key={data.key} className="chip-list">
                        <Chip
                          label={data.label}
                          color="primary"
                          onDelete={handleDelete(data)}
                        />
                      </div>
                    );
                  })}
                </div>

              </Grid>
            </Grid>
          </div>

          <InputLabel className="p-label">Approver</InputLabel>
          <FormControl className="p-select-width" size="small">
            <Select
              displayEmpty
              value={approver}
              className='p-select'
              onChange={handleChange}
              renderValue={(selected) => {
                var approver = getApprover(selected);
                if (selected.length === 0) {
                  return (
                    <span className="menuitem-placeholder">
                      Select Approver's Name
                    </span>
                  );
                }
                return approver?.firstName + " " + approver?.lastName;
              }}>
              {approverList?.map((approver) => (
                <MenuItem key={approver.id} value={approver.id}>
                  {approver.firstName + " " + approver.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formik.touched.approver && formik.errors.approver && (
            <div className="error-msg-container">
              <span className="alert" role="alert">
                {formik.errors.approver}
              </span>
            </div>
          )}

        </CustomAccordion>

        <Stack spacing={2} direction="row" className="p-btn" >
          <Button type="reset" variant="text" className="clear-btn" disabled={formik.isSubmitting} onClick={e => resetForm()} >
            Cancel
          </Button>
          <Button type="submit" variant="contained" className="submit-btn" disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}>
            {!formik.isSubmitting && <span>Submit</span>}
            {formik.isSubmitting && <span>Submitting... </span>}
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default Ticket;
