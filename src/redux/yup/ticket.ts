import * as Yup from "yup";
import { 
  CATEGORY, 
  CATEGORY_ERROR, 
  DATE_ERROR, 
  DATE_VALID_ERROR, 
  DESCRIPTION_ERROR, 
  DURATION, 
  FROM_DATE_ERROR, 
  PERMANENT, 
  PRIORITY_ERROR, 
  START_DATE, 
  TICKET_TYPE, 
  TIMELINE_ERROR, 
  TITLE_ERROR, 
  TYPE_ERROR, 
  VAILD_DATE_ERROR 
} from "../../constants";

const nonPreApprovedSchema = Yup.object().shape({
  descriptionSoftware: Yup.string().required(),
  softwareType: Yup.string().required(),
  licenseProvider: Yup.string().required(),
});

const nonPreApprovedValues = {
  descriptionSoftware: "",
  softwareType: "",
  licenseProvider: "",
};

const ticketSchema = Yup.object().shape({
  title: Yup.string().required(TITLE_ERROR),
  description: Yup.string().required(DESCRIPTION_ERROR),
  ticketType: Yup.string().required(TYPE_ERROR),
  category: Yup.string().required(CATEGORY_ERROR),
  priority: Yup.string().required(PRIORITY_ERROR),
  duration: Yup.string().required(TIMELINE_ERROR),
  approver: Yup.object().when([TICKET_TYPE, CATEGORY], {
    is: (ticketType: string,  category: string) => { if(ticketType === "1" && category !== "3") {return true}} ,
    then: Yup.object().required(),
    otherwise: Yup.object().nullable(),
  }),
  startDate: Yup.date().when(DURATION, {
    is: (duration: string) => duration === PERMANENT,
    then: Yup.date().nullable(),
    otherwise: Yup.date()
      .required(FROM_DATE_ERROR)
      .typeError(VAILD_DATE_ERROR),
  }),
  endDate: Yup.date().when(DURATION, {
    is: (duration: string) => duration === PERMANENT,
    then: Yup.date().nullable(),
    otherwise: Yup.date()
      .min(Yup.ref(START_DATE), DATE_VALID_ERROR)
      .required(DATE_ERROR)
      .typeError(VAILD_DATE_ERROR),
  }),
  preApprovedSoftware: Yup.array().when([TICKET_TYPE, CATEGORY], {
    is: (ticketType: string, category: string) => ticketType === "1" && category === "3",
    then: Yup.array().min(1).required(),
    otherwise: Yup.array().nullable(),
  }),
  nonPreApprovedSoftware: Yup.array().when([TICKET_TYPE, CATEGORY], {
    is: (ticketType: string, category: string) => ticketType === "1" && category === "2",
    then: Yup.array().min(1).required(),
    otherwise: Yup.array().nullable(),
  }),
  accessType: Yup.string().when([TICKET_TYPE, CATEGORY], {
    is: (ticketType: string, category: string) => ticketType === "1" && category === "5",
    then: Yup.string().required(),
    otherwise: Yup.string().nullable(),
  }),
});

const initialValues = {
  title: "",
  description: "",
  ticketType: "",
  category: "",
  priority: "",
  duration: "",
  approver: null,
  startDate: null,
  endDate: null,
  preApprovedSoftware: [],
  nonPreApprovedSoftware: [],
  accessType:""
};

export { nonPreApprovedSchema, nonPreApprovedValues, ticketSchema, initialValues }