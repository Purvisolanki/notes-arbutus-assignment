import React, { useState } from "react";
import {
    Button, Typography, FormControlLabel, Switch, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination,
    Grid, Tooltip, Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PrimarySearchAppBar from "../shared-components/Navbar";
import { handleAddNotes, handleCreateDialog, handleDeleteDialog, handleDeleteNote, handleChangePage,handleChangeRowsPerPage ,handleSearch, handleUpdateNote, handleStatus } from "../redux/notesSlice";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InfoIcon from '@mui/icons-material/Info';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import toast from "react-hot-toast";

function DashboardPage() {
    const { createNotesDialog, deleteNotesDialog } = useSelector((state) => state.notes.dialogState);
    const { notes } = useSelector((state) => state.notes);
    const { searchInput } = useSelector((state) => state.notes);
    const [editData, setEditData] = useState(null);
    const [noteId, setNoteId] = useState(null);
    const { page } = useSelector((state) => state.notes.pagination);
    const { rowsPerPage } = useSelector((state) => state.notes.pagination);

    const dispatch = useDispatch();

    const ChangePage = (event, newPage) => {
        dispatch(handleChangePage(newPage));
    };
    
    const ChangeRowsPerPage = (event) => {
        dispatch(handleChangeRowsPerPage(parseInt(event.target.value, 10)));
        dispatch(handleChangePage(0));
    };

    const handleDialogOpen = (data = null) => {
        if (data) {
            setEditData(data);
        } else {
            setEditData(null);
        }
        dispatch(handleCreateDialog(true));
    };

    const handleDialogClose = () => {
        dispatch(handleCreateDialog(false));
        setEditData(null);
    };

    const handleSubmit = async (values, { resetForm }) => {
        if (editData) {
            dispatch(handleUpdateNote({ ...editData, ...values }));
        } else {
            const timestamp = new Date().getTime();
            const uniqueId = notes.length + 1 + "_" + timestamp;
            dispatch(handleAddNotes({ id: uniqueId, status: false, ...values }));
        }
        handleDialogClose();
        resetForm();
    };

    const handleUpdate = (note) => {
        handleDialogOpen(note);
    };

    const handleDelete = (id) => {
        dispatch(handleDeleteDialog(true));
        setNoteId(id)
    }

    const deleteNote = () => {
        dispatch(handleDeleteNote(noteId));
        dispatch(handleDeleteDialog(false));
    }
    const CreateNotesValidationSchema = Yup.object().shape({
        title: Yup.string().min(3, "Title is too short").required("Required"),
        description: Yup.string().required("Required"),
    });

    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&::before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&::after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));

    const handleNotesStatus = (notesId) => {
        dispatch(handleStatus(notesId))
    }

    const handleSearchChange = (event) => {
        console.log('values change hori gai')
        dispatch(handleSearch(event.target.value));
    };


    const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchInput.toLowerCase()));

    const paginatedNotes = filteredNotes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <PrimarySearchAppBar />
            <Dialog open={createNotesDialog} onClose={handleDialogClose}>
                <Formik
                    initialValues={{
                        title: editData ? editData.title : '',
                        description: editData ? editData.description : '',
                    }}
                    validationSchema={CreateNotesValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {(formik) => (
                        <Form>
                            <DialogTitle className="bg-[#6437B4] text-white">
                                {editData ? "Update Notes" : "Create Notes"}
                            </DialogTitle>
                            <DialogContent className="mt-3" >
                                <DialogContentText>
                                    {editData ? "" : "To Create Notes, please enter Title and Description here."}
                                </DialogContentText>
                                <TextField
                                    required
                                    type='text'
                                    name='title'
                                    placeholder='Title'
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="outlined-required"
                                    label="Title"
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    required
                                    type='text'
                                    name='description'
                                    placeholder='Description'
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    id="outlined-required"
                                    label="Description"
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    fullWidth
                                    margin="normal"
                                />
                            </DialogContent>
                            <DialogActions sx={{marginRight: 2, marginBottom: 1}}>
                                <Button onClick={handleDialogClose} sx={{
                                    backgroundColor: "lightgrey", borderRadius: 1, color: "black", textTransform: 'capitalize', "&:hover": {
                                        backgroundColor: "gray", color: '#fff'
                                    }
                                }}>Cancel</Button>
                                <Button type="submit" disabled={formik.isSubmitting} sx={{
                                    border: '1px solid #6437B4', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
                                        backgroundColor: '#fff', color: '#6437B4',
                                    },
                                }}>
                                    {editData ? "Update" : "Create"}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>

            </Dialog>
            <div>
                <Grid container width='90%' marginInline='auto'>
                    <Grid container item justifyContent='space-between' alignItems='center' sx={{ paddingTop: "2%" }}>
                        <Typography variant="h5" >List of Notes</Typography>
                        <Button onClick={() => handleDialogOpen()} sx={{
                            border: '1px solid #6437B4', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
                                backgroundColor: '#fff', color: '#6437B4',
                            },
                        }}><AddCircleIcon fontSize="medium" />&nbsp;
                            Create Notes
                        </Button>
                    </Grid>
                    <TableContainer component={Paper} sx={{ width: "100%", marginTop: '3%', paddingInline: 2 }}>
                        <Grid container marginBlock={2}>
                            <TextField id="outlined-search" type="search" placeholder="Search Notes..." size="small" autoFocus='false' sx={{ position: 'relative' }} onChange={handleSearchChange}>
                                <SearchIcon fontSize="medium" sx={{ position: 'absolute' }} />
                            </TextField>
                        </Grid>

                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#6437B4' }}>
                                <TableRow >
                                    <TableCell sx={{ color: '#fff' }}>Id</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Title</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedNotes.length > 0 && (
                                    paginatedNotes.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.title}
                                            </TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>
                                            <Switch   onClick={() => handleNotesStatus(row.id)} sx={{color: '#6437B4 !important'}}/>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" spacing={4}>
                                                    <Tooltip title="Edit">
                                                        <ModeEditIcon
                                                            fontSize="small"
                                                            onClick={() => handleUpdate(row)}
                                                            className="cursor-pointer text-[#6437B4]"
                                                            style={{ marginRight: '16px' }} // Adjust the margin as needed
                                                        />
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <DeleteIcon
                                                            fontSize="small"
                                                            onClick={() => handleDelete(row.id)}
                                                            className="cursor-pointer text-red-500"
                                                        />
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {paginatedNotes.length <= 0 && <Grid item container xs={12} spacing={2} sx={{ height: '500px' }} justifyContent={'center'} alignItems={'center'}>
                            <Grid item>
                                <InfoIcon sx={{ color: '#6437B4', fontSize: 40 }} />
                            </Grid>
                            <Grid item>
                                <Typography fontSize={18} fontWeight={600}>Notes Not Found!!</Typography>
                            </Grid>
                        </Grid>}
                        <TablePagination
                            rowsPerPageOptions={[]}
                            component="div"
                            count={filteredNotes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={ChangePage}
                            onRowsPerPageChange={ChangeRowsPerPage}
                        />
                    </TableContainer>

                    <Dialog
                        open={deleteNotesDialog}
                        onClose={() => dispatch(handleDeleteDialog(false))}
                    >
                        <DialogTitle className="bg-[#6437B4] text-white">Delete Notes</DialogTitle>
                        <DialogContent className="mt-3">
                            <DialogContentText>
                                Are you sure you want to delete this note?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => dispatch(handleDeleteDialog(false))} sx={{
                                backgroundColor: "lightgrey", borderRadius: 1, color: "black", textTransform: 'capitalize', "&:hover": {
                                    backgroundColor: "gray", color: '#fff'
                                }
                            }}>Cancel</Button>
                            <Button onClick={() => deleteNote()} sx={{
                                border: '1px solid #6437B4', borderRadius: 1, color: '#fff', textTransform: 'capitalize', backgroundColor: '#6437B4', '&:hover': {
                                    backgroundColor: '#fff', color: '#6437B4',
                                },
                            }}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </div>
        </>
    );
}

export default DashboardPage;