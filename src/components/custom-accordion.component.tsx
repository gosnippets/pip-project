import { Accordion, AccordionSummary, AccordionDetails, Avatar, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface MyProps {
    index: string,
    title: string,
    children?: React.ReactNode
}

function CustomAccordion({ index, title, children }: MyProps) {
    return (
        <Grid container spacing={2} className='p-accordion'>
            <Grid item xs={2} md={1} lg={0.6} >
                <Avatar className='accordion-avatar'>{index}</Avatar>
            </Grid>
            <Grid item xs={10} md={11} lg={11.4}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <Typography className='accordion-typography'>{title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails className='accordion-details'>{children}</AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
}

export default CustomAccordion;
