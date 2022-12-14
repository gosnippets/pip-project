import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, FormControl, InputLabel, MenuItem, Stack, Typography, Select, SelectChangeEvent } from "@mui/material";
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

export const Ticket: React.FC = () => {
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
        console.log('response',response)
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

  return (
    <>
      <Typography variant="h6" className="p-typography">Create New Ticket</Typography>
      <ToastContainer closeOnClick={true} /> 

      <form id="ticket_form" onSubmit={formik.handleSubmit}>
        <CustomAccordion index="1" title="Let us know about your ticket">
          <TicketForm formik={formik} />
        </CustomAccordion>

        <CustomAccordion index="2" title="Detailed Information">
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
          <Button type="reset" variant="text" disabled={formik.isSubmitting} onClick={e => resetForm()} >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}>
            {!formik.isSubmitting && <span>Submit</span>}
            {formik.isSubmitting && <span>Submitting... </span>}
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default Ticket;
