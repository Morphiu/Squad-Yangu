import React from 'react';
import { Container, AppBar, Typography, Grow, Grid2 } from '@mui/material';

import squad from './images/squad-yangu.jpg';
import Posts from './components/Posts/Posts';
import Form from './components/Forms/Form';

const App = () => {
    return (
        <Container maxwidth='lg'>
            <AppBar position='static' color='inherit'>
                <Typography variant='h2' align='center'>Squad Yangu </Typography>
                <img src={squad} alt='a group of people' height="90" />
            </AppBar>
            <Grow in>
                <Container>
                    <Grid2 container justifyContent="space-between" alignItems="stretch" spacing={3}>
                        <Grid2 item xs={12} sm={7}>
                            <Posts />
                        </Grid2>
                        <Grid2 item xs={12} sm={4}>
                            <Form />
                        </Grid2>
                    </Grid2>
                </Container>
            </Grow>
        </Container>
    );
}

export default App;