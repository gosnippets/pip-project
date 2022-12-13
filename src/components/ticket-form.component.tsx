import { FormControlLabel, InputLabel, Radio, RadioGroup, TextareaAutosize, TextField } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function TicketForm({ formik }: any) {
    return (<>
        <InputLabel className='p-label'>What is your Request?</InputLabel>
        <TextField required placeholder="Enter Title" variant="standard" {...formik.getFieldProps('title')} />
        {formik.touched.title && formik.errors.title && (
            <div className='error-msg-container'>
                <span className='alert' role='alert'>{formik.errors.title}</span>
            </div>
        )}

        <InputLabel className='p-label mt-25'>Can you please write in brief about your Request?</InputLabel>
        <TextareaAutosize required minRows={4} placeholder="Enter Description" className='p-textarea' {...formik.getFieldProps('description')} />
        {formik.touched.description && formik.errors.description && (
            <div className='error-msg-container'>
                <span className='alert' role='alert'>{formik.errors.description}</span>
            </div>
        )}

        <InputLabel className='p-label mt-25'>Which type of Ticket would you like to Raise?</InputLabel>
        <RadioGroup row name="row-radio-buttons-group" {...formik.getFieldProps('ticketType')}>
            <FormControlLabel value="1" control={<Radio />} label="Request" className='radio-label' />
            <FormControlLabel value="2" control={<Radio />} label="Issue" className='radio-label' />
            <FormControlLabel value="3" control={<Radio />} label="Security Incident" className='radio-label' />
        </RadioGroup>
        {formik.touched.ticketType && formik.errors.ticketType && (
            <div className='error-msg-container'>
                <span className='alert' role='alert'>{formik.errors.ticketType}</span>
            </div>
        )}

        <InputLabel className='p-label mt-25'>What kind of Request you want to proceed with?</InputLabel>
        <RadioGroup row name="row-radio-buttons-group" {...formik.getFieldProps('categoryType')}>
            <FormControlLabel value="1" control={<Radio />} label="Hardware" className='radio-label' />
            <FormControlLabel value="2" control={<Radio />} label="Software" className='radio-label' />
            <FormControlLabel value="3" control={<Radio />} label="Network" className='radio-label' />
            <FormControlLabel value="4" control={<Radio />} label="Access" className='radio-label' />
        </RadioGroup>
        {formik.touched.categoryType && formik.errors.categoryType && (
            <div className='error-msg-container'>
                <span className='alert' role='alert'>{formik.errors.categoryType}</span>
            </div>
        )}

        <InputLabel className='p-label mt-25'>Let us know the Priority.</InputLabel>
        <RadioGroup row name="row-radio-buttons-group" {...formik.getFieldProps('priorityType')}>
            <FormControlLabel value="1" control={<Radio />} label="Critical" className='radio-label' />
            <FormControlLabel value="2" control={<Radio />} label="High" className='radio-label' />
            <FormControlLabel value="3" control={<Radio />} label="Medium" className='radio-label' />
            <FormControlLabel value="4" control={<Radio />} label="Low" className='radio-label' />
        </RadioGroup>
        {formik.touched.priorityType && formik.errors.priorityType && (
            <div className='error-msg-container'>
                <span className='alert' role='alert'>{formik.errors.priorityType}</span>
            </div>
        )}

        <InputLabel className='p-label mt-25'>What is the Timeline of your Request?</InputLabel>
        <RadioGroup row name="row-radio-buttons-group" {...formik.getFieldProps('timelineType')}>
            <FormControlLabel value="Temporary" control={<Radio />} label="Temporary" className='radio-label' />
            <FormControlLabel value="Permanent" control={<Radio />} label="Permanent" className='radio-label' />
        </RadioGroup>
        {formik.touched.timelineType && formik.errors.timelineType && (
            <div className='error-msg-container'>
                <span className='alert' role='alert'>{formik.errors.timelineType}</span>
            </div>
        )}

        <InputLabel className={`p-label mt-25 ${formik.values?.timelineType === 'Permanent' ? 'disabled' : ''}`}>What is the Duration of your Request?</InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='date-container'>
                <div className='date'>
                    <DatePicker
                        label="From Date"
                        minDate={new Date()}
                        disabled={formik.values?.timelineType === 'Permanent' ? true : false}
                        inputFormat="YYYY-MM-DD"
                        {...formik.getFieldProps('fromDate')}
                        onChange={(newValue) => {
                            formik.setFieldValue("fromDate", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} variant="standard" />}
                    />
                    {formik.touched.timelineType && formik.errors.fromDate && (
                        <div className='error-msg-container'>
                            <span className='alert' role='alert'>{formik.errors.fromDate}</span>
                        </div>
                    )}
                </div>
                <div className='date'>
                    <DatePicker
                        label="To Date"
                        minDate={formik.values?.fromDate ? formik.values.fromDate : new Date()}
                        disabled={formik.values?.timelineType === 'Permanent' ? true : false}
                        inputFormat="YYYY-MM-DD"
                        {...formik.getFieldProps('toDate')}
                        onChange={(newValue) => {
                            formik.setFieldValue("toDate", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} variant="standard" />}
                    />
                    {formik.touched.timelineType && formik.errors.toDate && (
                        <div className='error-msg-container'>
                            <span className='alert' role='alert'>{formik.errors.toDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </LocalizationProvider>
    </>);
}

export default TicketForm;
