import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
  Select,
  SelectChangeEvent,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Radio,
  RadioGroup,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomAccordion from "../../components/accordion/customAccordion";
import TicketForm from "../../components/ticket-form/ticketForm";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import { useAppDispatch } from "../../redux/hooks";
import { getApprovers } from "../../redux/apis/approver";
import { RootState } from "../../redux/store";
import { dateFormat } from "../../utils/dateFormat";
import { addTicket } from "../../redux/apis/ticket";
import { INonPreApproved, IPreApproved, ISoftware } from "../../redux/models/software";
import { getSoftwares } from "../../redux/apis/software";
import "./ticket.css";
import { nonPreApprovedSchema, nonPreApprovedValues, ticketSchema, initialValues } from "../../redux/yup/ticket";
import {
  ADD_TICKET,
  API_FAILING,
  APPROVER,
  END_DATE,
  LICENSE_PROVIDER,
  NON_PRE_APPROVED_SOFTWARES,
  PERMANENT,
  PRE_APPROVED_SOFTWARES,
  SOFTWARE_DESCRIPTION,
  SOFTWARE_TYPE,
  START_DATE
} from "../../constants";

export const Ticket: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getApprovers());
    dispatch(getSoftwares());
  }, [dispatch]);

  const approverList = useSelector((state: RootState) => state.approver.list);
  const softwareList = useSelector((state: RootState) => state.software.list);

  const [preApprovedSelectedList, setPreApprovedSelectedList] = useState<readonly IPreApproved[]>([]);
  const [softwareListData, setSoftwareListData] = useState<readonly ISoftware[]>(softwareList);
  const [softwareError, setSoftwareError] = useState("");
  const [approver, setApprover] = useState("");

  useEffect(() => {
    setSoftwareListData(softwareList);
  }, [softwareList]);

  const formik = useFormik({
    initialValues,
    validationSchema: ticketSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log("values", values);

      const data = {
        tickets: {
          title: values.title,
          description: values.description,
          ticketType: { id: values.ticketType },
          category: { id: values.category },
          priority: { id: values.priority },
          duration: values.duration,
          approvedBy:  values.approver,
          accessType: values.accessType,
          facingIssue: null,
          startDate: dateFormat(values.startDate),
          endDate: dateFormat(values.endDate),
          nonPreApprovedSoftware: values.nonPreApprovedSoftware,
        },
        selectedSoftwares: {
          preApprovedSoftware: values.preApprovedSoftware
        },
        images: [],
      };

      console.log("data", data);

      dispatch(addTicket(data))
        .unwrap()
        .then((response) => {
          if (response) {
            resetForm();
            console.log("response", response);
            toast.success(ADD_TICKET);
          } else {
            formik.setSubmitting(false);
            toast.error(API_FAILING);
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
    setApprover("");
    setPreApprovedSelectedList([]);
  };

  const softFormik = useFormik({
    initialValues: nonPreApprovedValues,
    validationSchema: nonPreApprovedSchema,
    onSubmit: () => { },
  });

  const addNonApprovedSoftware = () => {
    formik.setFieldValue(NON_PRE_APPROVED_SOFTWARES, [
      ...formik.values.nonPreApprovedSoftware,
      softFormik.values,
    ]);
    resetNonApprovedSoftwareForm();
  };

  const resetNonApprovedSoftwareForm = () => {
    softFormik.setSubmitting(false);
    softFormik.resetForm();
  };

  const handleDeleteNonApproved = (key: number) => () => {
    const filteredNonPreApproved = formik.values.nonPreApprovedSoftware.filter(
      (item, index) => index !== key
    );
    formik.setFieldValue(NON_PRE_APPROVED_SOFTWARES, filteredNonPreApproved);
  };

  useEffect(() => {
    if (formik.values.duration === PERMANENT) {
      formik.setFieldValue(START_DATE, null);
      formik.setFieldValue(END_DATE, null);
    }
    // eslint-disable-next-line
  }, [formik.values.duration]);

  useEffect(() => {
    if (
      formik.values.preApprovedSoftware.length > 0 ||
      formik.values.nonPreApprovedSoftware.length > 0
    ) {
      setSoftwareError("");
    }
    // eslint-disable-next-line
  }, [formik.values.preApprovedSoftware, formik.values.nonPreApprovedSoftware]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setApprover(event.target.value);
    formik.setFieldValue(APPROVER, { employeeId: event.target.value} );
  };

  const getApprover = (employeeId: any) => {
    return approverList?.find((approver) => approver.employeeId === employeeId);
  };

  const getSoftware = (id: any) => {
    return preApprovedSelectedList?.find((software) => software.id === id);
  };

  const searchSoftware = (search: string) => {
    setSoftwareListData(
      softwareList?.filter((software) =>
        software.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleSoftwareSelected = (value: IPreApproved) => {
    const software = getSoftware(value.id);
    if (software) {
      handleRemoveSoftware(value);
    } else {
      formik.setFieldValue(PRE_APPROVED_SOFTWARES, [
        ...formik.values.preApprovedSoftware,
        value.id,
      ]);
      setPreApprovedSelectedList([...preApprovedSelectedList, value]);
    }
  };

  const handleRemoveSoftware = (data: IPreApproved) => {
    const filteredPreApproved = preApprovedSelectedList.filter(
      (item) => item.id !== data.id
    );
    setPreApprovedSelectedList(filteredPreApproved);
    formik.setFieldValue(PRE_APPROVED_SOFTWARES, filteredPreApproved);
  };

  return (
    <>
      <Typography variant="h6" className="p-typography">
        Create New Ticket
      </Typography>
      <ToastContainer closeOnClick={true} />

      <form id="ticket_form" onSubmit={formik.handleSubmit}>
        <CustomAccordion index="1" title="Let us know about your ticket">
          <TicketForm formik={formik} />
        </CustomAccordion>

        {formik.values.ticketType !== "2" && (
          <CustomAccordion index="2" title="Detailed Information">
            {formik.values.ticketType === "1" &&
              formik.values.category === "3" && (
                <div className="software-container">
                  <Grid container spacing={7} className="grid-container">
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader
                          className="card-header"
                          title="Pre Approved Software"
                        />
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
                          <List
                            sx={{
                              width: "100%",
                              maxWidth: 360,
                              bgcolor: "background.paper",
                            }}
                          >
                            {softwareListData?.map((value, key) => {
                              const labelId = `software-${value.id}`;
                              return (
                                <ListItem
                                  key={key}
                                  secondaryAction={
                                    <ListItemText
                                      id={labelId}
                                      primary={value.version}
                                    />
                                  }
                                  disablePadding
                                >
                                  <ListItemButton
                                    role={undefined}
                                    onClick={() =>
                                      handleSoftwareSelected(value)
                                    }
                                    dense
                                  >
                                    <ListItemIcon>
                                      <Checkbox
                                        edge="start"
                                        checked={
                                          getSoftware(value.id) ? true : false
                                        }
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                          "aria-labelledby": labelId,
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      id={labelId}
                                      primary={value.name}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </CardContent>
                      </Card>
                      {formik.values?.preApprovedSoftware.length > 0 && (
                        <div className="selection-container">
                          <InputLabel className="selection-label">
                            Selection
                          </InputLabel>
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
                  </Grid>
                </div>
              )}

            {formik.values.ticketType === "1" &&
              formik.values.category === "2" && (
                <div className="software-container">
                  <Grid container spacing={7} className="grid-container">
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardHeader
                          className="card-header"
                          title="Non Pre Approved Software"
                        />
                        <CardContent>
                          <InputLabel className="p-label">Software</InputLabel>
                          <TextField
                            fullWidth
                            placeholder="Enter Software Name"
                            {...softFormik.getFieldProps(SOFTWARE_DESCRIPTION)}
                          />

                          <InputLabel className="p-label mt-25">
                            What is the type of software?
                          </InputLabel>
                          <RadioGroup
                            row
                            {...softFormik.getFieldProps(SOFTWARE_TYPE)}
                          >
                            <FormControlLabel
                              value="License"
                              control={<Radio />}
                              label="License"
                              className="radio-label"
                            />
                            <FormControlLabel
                              value="Open Source"
                              control={<Radio />}
                              label="Open Source"
                              className="radio-label"
                            />
                          </RadioGroup>

                          <InputLabel className="p-label mt-25">
                            Who is the license provider?
                          </InputLabel>
                          <RadioGroup
                            row
                            {...softFormik.getFieldProps(LICENSE_PROVIDER)}
                          >
                            <FormControlLabel
                              value="Afour Technologies"
                              control={<Radio />}
                              label="Afour Technologies"
                              className="radio-label"
                            />
                            <FormControlLabel
                              value="Client"
                              control={<Radio />}
                              label="Client"
                              className="radio-label"
                            />
                          </RadioGroup>
                        </CardContent>
                        <CardActions>
                          <Stack
                            spacing={2}
                            direction="row"
                            className="p-btn non-software-btn"
                          >
                            <Button
                              className="clear-btn"
                              variant="text"
                              onClick={(e) => resetNonApprovedSoftwareForm()}
                              disabled={
                                !softFormik.values.descriptionSoftware &&
                                !softFormik.values.softwareType &&
                                !softFormik.values.licenseProvider
                              }
                            >
                              Clear
                            </Button>
                            <Button
                              className="submit-btn"
                              variant="contained"
                              onClick={(e) => addNonApprovedSoftware()}
                              disabled={
                                softFormik.isSubmitting ||
                                !(softFormik.isValid && softFormik.dirty)
                              }
                            >
                              {!softFormik.isSubmitting && <span>Add</span>}
                              {softFormik.isSubmitting && (
                                <span>Adding... </span>
                              )}
                            </Button>
                          </Stack>
                        </CardActions>
                      </Card>
                      {formik.values?.nonPreApprovedSoftware.length > 0 && (
                        <>
                          <InputLabel className="selection-label">
                            Selection
                          </InputLabel>
                          <div className="chip">
                            {formik.values?.nonPreApprovedSoftware.map(
                              (data: INonPreApproved, key) => {
                                return (
                                  <div key={key} className="chip-list">
                                    <Chip
                                      label={data.descriptionSoftware}
                                      color="primary"
                                      onDelete={handleDeleteNonApproved(key)}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </>
                      )}
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

            {formik.values.ticketType === "1" &&
              formik.values.category === "5" && (<>
                <InputLabel className='p-label'>Which access do you want?</InputLabel>
                <RadioGroup row className="mb-20" {...formik.getFieldProps('accessType')}>
                  <FormControlLabel value="Admin" control={<Radio />} label="Admin" className='radio-label' />
                  <FormControlLabel value="AWS" control={<Radio />} label="AWS" className='radio-label' />
                  <FormControlLabel value="Azure" control={<Radio />} label="Azure" className='radio-label' />
                  <FormControlLabel value="Geeklab" control={<Radio />} label="Geeklab" className='radio-label' />
                  <FormControlLabel value="Redmine" control={<Radio />} label="Redmine" className='radio-label' />
                  <FormControlLabel value="Testlink" control={<Radio />} label="Testlink" className='radio-label' />
                  <FormControlLabel value="USB" control={<Radio />} label="USB" className='radio-label' />
                  <FormControlLabel value="VM(Virtual Machine)" control={<Radio />} label="VM(Virtual Machine)" className='radio-label' />
                </RadioGroup>
                {formik.touched.category && formik.errors.category && (
                  <div className='error-msg-container'>
                    <span className='alert' role='alert'>{formik.errors.category}</span>
                  </div>
                )}
              </>)}

            {formik.values.ticketType === "1" &&
              formik.values.category !== "3" && (<>
                <InputLabel className="p-label">Approver</InputLabel>
                <FormControl className="p-select-width" size="small">
                  <Select
                    displayEmpty
                    value={approver}
                    className="p-select"
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
                    }}
                  >
                    {approverList?.map((approver) => (
                      <MenuItem key={approver.employeeId} value={approver.employeeId}>
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

        <Stack spacing={2} direction="row" className="p-btn">
          <Button
            type="reset"
            variant="text"
            className="clear-btn"
            disabled={formik.isSubmitting}
            onClick={() => resetForm()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="submit-btn"
            disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
          >
            {!formik.isSubmitting && <span>Submit</span>}
            {formik.isSubmitting && <span>Submitting... </span>}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default Ticket;
