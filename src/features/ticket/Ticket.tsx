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
import { ISoftware } from "../../redux/models/software.model";

const nonPreApprovedSchema = Yup.object().shape({
  descriptionSoftware: Yup.string().required(),
  softwareType: Yup.string().required(),
  licenseProvider: Yup.string().required()
});

const nonPreApprovedValues = {
  descriptionSoftware: "",
  softwareType: "",
  licenseProvider: "",
};

const ticketSchema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
  description: Yup.string().required("Description is Required"),
  ticketType: Yup.string().required("Type is Required"),
  category: Yup.string().required("Category is Required"),
  priority: Yup.string().required("Priority is Required"),
  duration: Yup.string().required("Timeline is Required"),
  approver: Yup.string().when(["ticketType", "category"], {
    is: (ticketType: string, category: string) => ticketType === "1" && (category === "1" || category === "3"),
    then: Yup.string().required(),
    otherwise: Yup.string().nullable(),
  }),
  startDate: Yup.date().when("duration", {
    is: (duration: string) => duration === "Permanent",
    then: Yup.date().nullable(),
    otherwise: Yup.date()
      .required("From Date is Required")
      .typeError("Please enter a valid date"),
  }),
  endDate: Yup.date().when("duration", {
    is: (duration: string) => duration === "Permanent",
    then: Yup.date().nullable(),
    otherwise: Yup.date().min(Yup.ref('startDate'), "To date can't be before from date")
      .required("To Date is Required")
      .typeError("Please enter a valid date"),
  }),
  preApprovedSoftware: Yup.array().when(["ticketType", "category"], {
    is: (ticketType: string, category: string) => category === "2",
    then: Yup.array().required(),
    otherwise: Yup.array().nullable(),
  }),
  nonPreApprovedSoftware: Yup.array().when(["ticketType", "category"], {
    is: (ticketType: string, category: string) => ticketType === "1" && category === "2",
    then: Yup.array().required(),
    otherwise: Yup.array().nullable(),
  })
});

const initialValues = {
  title: "",
  description: "",
  ticketType: "",
  category: "",
  priority: "",
  duration: "",
  approver: "",
  startDate: null,
  endDate: null,
  preApprovedSoftware: [],
  nonPreApprovedSoftware: []
};

interface IPreApproved {
  id: number;
  name: string;
}

interface INonPreApproved {
  descriptionSoftware: string,
  softwareType: string,
  licenseProvider: string,
}

// const softwareList = [
//   {
//     "id": 1,
//     "name": "Node",
//     "version": "15.7",
//     "active": false
//   },
//   {
//     "id": 2,
//     "name": "Java",
//     "version": "15.7",
//     "active": false
//   },
//   {
//     "id": 3,
//     "name": "Vscode",
//     "version": "16.7",
//     "active": false
//   },
//   {
//     "id": 4,
//     "name": "Git",
//     "version": "17.7",
//     "active": false
//   },
//   {
//     "id": 5,
//     "name": "Eclipse",
//     "version": "14.7",
//     "active": false
//   },
//   {
//     "id": 6,
//     "name": "Pycharm",
//     "version": "15.7",
//     "active": false
//   },
//   {
//     "id": 7,
//     "name": "Jupiter",
//     "version": "15.7",
//     "active": false
//   },
//   {
//     "id": 8,
//     "name": "Anydesk",
//     "version": "16.7",
//     "active": false
//   },
//   {
//     "id": 9,
//     "name": "VPN",
//     "version": "17.7",
//     "active": false
//   },
//   {
//     "id": 10,
//     "name": "Python",
//     "version": "14.7",
//     "active": false
//   }
// ];

export const Ticket: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getApprovers());
  }, [dispatch]);

  const approverList = useSelector((state: RootState) => state.approver.list);
  const softwareList = useSelector((state: RootState) => state.software.list);

  const [preApprovedSelectedList, setPreApprovedSelectedList] = useState<readonly IPreApproved[]>([]);
  const [softwareListData, setSoftwareListData] = useState<readonly ISoftware[]>(softwareList);
  const [softwareError, setSoftwareError] = useState("");
  const [approver, setApprover] = useState("");  

  const formik = useFormik({
    initialValues,
    validationSchema: ticketSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log("values", values);

      if (!(formik.values.preApprovedSoftware.length > 0 || formik.values.nonPreApprovedSoftware.length > 0)) {
        setSoftwareError("Please select any one from pre approved or non pre approved software");
        setSubmitting(false);
        return;
      }
      
      const data = {
        tickets: {
          title: values.title,
          description: values.description,
          ticketType: { id: values.ticketType },
          category: { id: values.category },
          priority: { id: values.priority },
          duration: values.duration,
          approvedBy: { id: values.approver },
          accessType: "",
          startDate: dateFormat(values.startDate),
          endDate: dateFormat(values.endDate)
        },
        selectedSoftwares: {
          preApprovedSoftware: values.preApprovedSoftware,
          nonPreApprovedSoftware: values.nonPreApprovedSoftware
        },
        images: []
      }

      console.log("data", data);

      dispatch(addTicket(data))
        .unwrap()
        .then((response) => {
          if (response) {
            resetForm();
            console.log('response', response)
            toast.success("Ticket added successfully!");
          } else {
            formik.setSubmitting(false);
            toast.error("Api failed");
          }
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
    setPreApprovedSelectedList([]);
  }

  const softFormik = useFormik({
    initialValues: nonPreApprovedValues,
    validationSchema: nonPreApprovedSchema,
    onSubmit: () => { },
  });

  const addNonApprovedSoftware = () => {
    formik.setFieldValue("nonPreApprovedSoftware", [...formik.values.nonPreApprovedSoftware, softFormik.values]);
    resetNonApprovedSoftwareForm();
  }

  const resetNonApprovedSoftwareForm = () => {
    softFormik.setSubmitting(false);
    softFormik.resetForm();
  }

  const handleDeleteNonApproved = (key: number) => () => {
    const filteredNonPreApproved = formik.values.nonPreApprovedSoftware.filter((item, index) => index !== key);
    formik.setFieldValue("nonPreApprovedSoftware", filteredNonPreApproved);
  };

  useEffect(() => {
    if (formik.values.duration === "Permanent") {
      formik.setFieldValue("startDate", null);
      formik.setFieldValue("endDate", null);
    }
    // eslint-disable-next-line
  }, [formik.values.duration]);

  useEffect(() => {
    if (formik.values.preApprovedSoftware.length > 0 || formik.values.nonPreApprovedSoftware.length > 0) {
      setSoftwareError("");
    }
    // eslint-disable-next-line
  }, [formik.values.preApprovedSoftware, formik.values.nonPreApprovedSoftware]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setApprover(event.target.value);
    formik.setFieldValue("approver", event.target.value);
  };

  const getApprover = (id: any) => {
    return approverList?.find((approver) => approver.id === id);
  };

  const getSoftware = (id: any) => {
    return preApprovedSelectedList?.find((software) => software.id === id);
  };

  const searchSoftware = (search: string) => {
    setSoftwareListData(softwareList?.filter((software) => software.name.toLowerCase().includes(search.toLowerCase())));
  };

  const handleSoftwareSelected = (value: IPreApproved) => {
    const software = getSoftware(value.id)
    if (software) {
      handleRemoveSoftware(value);
    } else {
      formik.setFieldValue("preApprovedSoftware", [...formik.values.preApprovedSoftware, value.id]);
      setPreApprovedSelectedList([...preApprovedSelectedList, value]);
    }
  };

  const handleRemoveSoftware = (data: IPreApproved) => {
    const filteredPreApproved = preApprovedSelectedList.filter((item) => item.id !== data.id);
    setPreApprovedSelectedList(filteredPreApproved);
    formik.setFieldValue("preApprovedSoftware", filteredPreApproved);
  };

  return (
    <>
      <Typography variant="h6" className="p-typography">Create New Ticket</Typography>
      <ToastContainer closeOnClick={true} />

      <form id="ticket_form" onSubmit={formik.handleSubmit}>
        <CustomAccordion index="1" title="Let us know about your ticket">
          <TicketForm formik={formik} />
        </CustomAccordion>

        {formik.values.ticketType !== "2" && (
          <CustomAccordion index="2" title="Detailed Information">

            {formik.values.ticketType === "1" && formik.values.category === "2" && (
              <div className="software-container">

                <Grid container spacing={7} className="grid-container">
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader className="card-header" title="Pre Approved Software" />
                      <TextField
                        fullWidth
                        placeholder="Search"
                        className="search-text-field"
                        onChange={(e) => searchSoftware(e.target.value)}
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
                          {softwareListData.map((value, key) => {
                            const labelId = `software-${value.id}`;
                            return (
                              <ListItem
                                key={key}
                                secondaryAction={
                                  <ListItemText id={labelId} primary={value.version} />
                                }
                                disablePadding
                              >
                                <ListItemButton role={undefined} onClick={() => handleSoftwareSelected(value)} dense>
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={getSoftware(value.id) ? true : false}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText id={labelId} primary={value.name} />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </CardContent>
                    </Card>
                    {formik.values?.preApprovedSoftware.length > 0 && (
                      <div className="selection-container">
                        <InputLabel className="selection-label">Selection</InputLabel>
                        <div className="chip">
                          {preApprovedSelectedList.map((data, key) => {
                            return (
                              <div key={key} className="chip-list">
                                <Chip
                                  label={data.name}
                                  color="primary"
                                  onDelete={() => handleRemoveSoftware(data)}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader className="card-header" title="Non Pre Approved Software" />
                      <CardContent>
                        <InputLabel className='p-label'>Software</InputLabel>
                        <TextField fullWidth placeholder="Enter Software Name" {...softFormik.getFieldProps('descriptionSoftware')} />

                        <InputLabel className='p-label mt-25'>What is the type of software?</InputLabel>
                        <RadioGroup row {...softFormik.getFieldProps('softwareType')}>
                          <FormControlLabel value="License" control={<Radio />} label="License" className='radio-label' />
                          <FormControlLabel value="Open Source" control={<Radio />} label="Open Source" className='radio-label' />
                        </RadioGroup>

                        <InputLabel className='p-label mt-25'>Who is the license provider?</InputLabel>
                        <RadioGroup row {...softFormik.getFieldProps('licenseProvider')}>
                          <FormControlLabel value="Afour Technologies" control={<Radio />} label="Afour Technologies" className='radio-label' />
                          <FormControlLabel value="Client" control={<Radio />} label="Client" className='radio-label' />
                        </RadioGroup>

                      </CardContent>
                      <CardActions>
                        <Stack spacing={2} direction="row" className="p-btn non-software-btn" >
                          <Button className="clear-btn" variant="text" onClick={e => resetNonApprovedSoftwareForm()} disabled={!softFormik.values.descriptionSoftware && !softFormik.values.softwareType && !softFormik.values.licenseProvider}>
                            Clear
                          </Button>
                          <Button className="submit-btn" variant="contained" onClick={e => addNonApprovedSoftware()} disabled={softFormik.isSubmitting || !(softFormik.isValid && softFormik.dirty)}>
                            {!softFormik.isSubmitting && <span>Add</span>}
                            {softFormik.isSubmitting && <span>Adding... </span>}
                          </Button>
                        </Stack>
                      </CardActions>
                    </Card>
                    {formik.values?.nonPreApprovedSoftware.length > 0 && (<>
                      <InputLabel className="selection-label">Selection</InputLabel>
                      <div className="chip">
                        {formik.values?.nonPreApprovedSoftware.map((data: INonPreApproved, key) => {
                          return (
                            <div key={key} className="chip-list">
                              <Chip
                                label={data.descriptionSoftware}
                                color="primary"
                                onDelete={handleDeleteNonApproved(key)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>)}
                  </Grid>
                </Grid>
              </div>
            )}

            {softwareError && (
              <div className="error-msg-container">
                <span className="alert" role="alert">
                  {softwareError}
                </span>
              </div>
            )}


            {formik.values.ticketType === "1" && (formik.values.category === "1" || formik.values.category === "3") && (<>
              <InputLabel className="p-label">Approver</InputLabel>
              <FormControl className="p-select-width" size="small">
                <Select
                  displayEmpty
                  value={approver}
                  className='p-select'
                  onChange={handleSelectChange}
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
            </>)}
          </CustomAccordion>
        )}

        <Stack spacing={2} direction="row" className="p-btn" >
          <Button type="reset" variant="text" className="clear-btn" disabled={formik.isSubmitting} onClick={() => resetForm()} >
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
