import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Container, Card, CardContent, Typography, Button, Grid, Avatar, Link } from '@mui/material';
import { handleUpdateUser, handleUpdateUserDialog, login } from "../redux/userSlice";
import EditIcon from '@mui/icons-material/Edit';
import PrimarySearchAppBar from '../shared-components/Navbar';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePage = () => {
    const { UpdateUserDialog } = useSelector((state) => state.user.dialogState);
    const { currentUser } = useSelector(state => state.user);
    const [editData, setEditData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        dispatch(login(user))
    }, [dispatch]);

    const handleDialogOpen = (data = null) => {
        setEditData(data);
        dispatch(handleUpdateUserDialog(true));
    };
    const handleDialogClose = () => {
        dispatch(handleUpdateUserDialog(false));
        setEditData(null);
    };
    const handleUpdate = (user) => {
        handleDialogOpen(user);
    };
    const handleSubmit = (values, { resetForm }) => {
        dispatch(handleUpdateUser({ ...editData, ...values }));
        handleDialogClose();
        resetForm();
    };

    const profileValidationSchema = Yup.object().shape({
        firstname: Yup.string()
            .required('First name is required'),
        lastname: Yup.string()
            .required('Last name is required'),
    });

    return (
        <>
            <PrimarySearchAppBar />
            <Grid container justifyContent='flex-end' paddingRight={4} paddingTop={4}>
                <Button 
                    sx={{
                        border: '1px solid #6437B4', borderRadius: 1, color: '#6437B4', textTransform: 'capitalize', backgroundColor: '#fff', '&:hover': {
                            backgroundColor: '#6437B4', color: '#fff',
                        },
                    }}>
                    <Link to='/dashboard' style={{ textDecoration: 'none', color: 'inherit' }}>Return To Dashboard</Link>
                </Button>
            </Grid>
            <Container maxWidth="sm" sx={{ paddingTop: "5%" }}>
                <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
                    <CardContent sx={{ paddingBlock: 4 }}>
                        <Grid container spacing={2} direction='column'>
                            <Grid item container justifyContent='center' alignItems='center' direction='column'>
                                <Grid item>
                                    <Avatar sx={{ bgcolor: '#6437B4', height: '80px', width: '80px' }} >
                                        <Avatar sx={{ bgcolor: '#E4F1FE', height: '72px', width: '72px' }} >
                                            <PersonIcon fontSize='large' sx={{ color: '#6437B4' }} />
                                        </Avatar>
                                    </Avatar>
                                </Grid>
                                <Grid item container justifyContent='center' gap={2} marginTop={3} sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' } }}>
                                    <Grid item container gap={1} paddingInline={2}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>First Name:</Typography>
                                        <Typography variant="h6">{currentUser?.firstname}</Typography>
                                    </Grid>
                                    <Grid item container gap={1} paddingInline={2}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Last Name:</Typography>
                                        <Typography variant="h6">{currentUser?.lastname}</Typography>
                                    </Grid>
                                    <Grid item container gap={1} paddingInline={2}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                                        <Typography variant="h6">{currentUser?.email}</Typography>
                                    </Grid>
                                    <Grid item container gap={1} paddingInline={2}>
                                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Phone Number:</Typography>
                                        <Typography variant="h6">{currentUser?.number}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center" direction='column'>
                            <Button
                                sx={{
                                    border: '1px solid #4A90E2', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
                                        backgroundColor: '#fff', color: '#4A90E2',
                                    },
                                }}
                                onClick={() => handleUpdate(currentUser)}
                            >
                                Update Profile
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
            <Dialog open={UpdateUserDialog} onClose={handleDialogClose}>
                <Formik
                    initialValues={{
                        firstname: editData ? editData.firstname : '',
                        lastname: editData ? editData.lastname : '',
                    }}
                    validationSchema={profileValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => (
                        <Form>
                            <DialogTitle>
                                <Grid item container justifyContent="center" alignItems="center" direction='column'>
                                    <Avatar sx={{ bgcolor: '#6437B4', height: '60px', width: '60px' }} >
                                        <Avatar sx={{ bgcolor: '#E4F1FE', height: '52px', width: '52px' }} >
                                            <PersonIcon fontSize='large' sx={{ color: '#6437B4' }} />
                                        </Avatar>
                                    </Avatar>
                                    Update Profile
                                </Grid>
                            </DialogTitle>
                            <DialogContent>
                                <TextField
                                    required
                                    type='text'
                                    name='firstname'
                                    placeholder='First name'
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="First Name"
                                    error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                                    helperText={formik.touched.firstname && formik.errors.firstname}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    required
                                    type='text'
                                    name='lastname'
                                    placeholder='Last name'
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Last Name"
                                    error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                                    helperText={formik.touched.lastname && formik.errors.lastname}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    disabled
                                    label="Email"
                                    defaultValue={currentUser?.email}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    disabled
                                    label="Phone Number"
                                    defaultValue={currentUser?.number}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button 
                                    sx={{
                                        backgroundColor: "lightgrey", borderRadius: 1, color: "black", textTransform: 'capitalize', "&:hover": {
                                            backgroundColor: "gray", color: '#fff'
                                        }
                                    }} 
                                    onClick={handleDialogClose}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={formik.isSubmitting} 
                                    sx={{
                                        border: '1px solid #4A90E2', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
                                            backgroundColor: '#fff', color: '#6437B4',
                                        },
                                    }} 
                                >
                                     Update
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default ProfilePage;
