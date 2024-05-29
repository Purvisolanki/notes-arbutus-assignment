import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Container, Card, CardContent, Typography, Button, Grid, Avatar, Link } from '@mui/material';
import { handleUpdateUser, handleUpdateUserDialog, login } from "../redux/userSlice";
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
            <Grid container marginLeft={3} marginTop={3} direction='column' sx={{ width: { xs: '80%', md: '40%', lg: '30%' } }}>
                <Grid item marginBottom={2}><Typography variant='h5'>Account Settings</Typography></Grid>
                <Grid item container direction='column' gap={2} marginLeft={2}>

                    <Grid item container gap={1}>
                        <Typography variant='h6'>First Name</Typography>
                        <TextField id="firstname" variant="outlined" size='small' defaultValue={currentUser?.firstname} fullWidth disabled />
                    </Grid>
                    <Grid item container gap={1}>
                        <Typography variant='h6'>Last Name</Typography>
                        <TextField id="lastname" variant="outlined" size='small' defaultValue={currentUser?.lastname} fullWidth disabled />
                    </Grid>
                    <Grid item container gap={1}>
                        <Typography variant='h6'>Email Address</Typography>
                        <TextField id="email" variant="outlined" size='small' defaultValue={currentUser?.email} fullWidth disabled />
                    </Grid>
                    <Grid item container gap={1}>
                        <Typography variant='h6'>Mobile Phone</Typography>
                        <TextField id="number" variant="outlined" size='small' defaultValue={currentUser?.number} fullWidth disabled />
                    </Grid>
                    <Grid item container justifyContent='flex-end'>
                        <Button
                            sx={{
                                border: '1px solid #6437B4', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
                                    backgroundColor: '#fff', color: '#6437B4',
                                },
                            }}
                            onClick={() => handleUpdate(currentUser)}
                        >
                            Update Profile
                        </Button>
                    </Grid>

                </Grid>
            </Grid>
            
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
                                    <Avatar sx={{ bgcolor: '#6437B4', height: '50px', width: '50px' }} >
                                        <AccountCircleIcon fontSize='large' sx={{ color: '#fff' }} />
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
                                        border: '1px solid #6437B4', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
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
