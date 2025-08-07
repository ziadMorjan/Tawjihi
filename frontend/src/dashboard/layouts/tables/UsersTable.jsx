import React, { useEffect, useMemo, useState } from 'react';
import MDBox from '../../components/MDBox';
import MDBadge from '../../components/MDBadge';
import MDTypography from '../../components/MDTypography';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFromApi, getUsersFromApi, updateUserFromApi } from '../../redux/usersSlice';
import Tables from '.';
import { Icon, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import MDButton from '../../components/MDButton';

function UsersTable({ usersType, tableTitle = "جدول المستخدمين" }) {

    const { users, isLoading } = useSelector((state) => state.usersReducer);
    const dispatch = useDispatch();

    // State for modal
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);


    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [nameFealed, setNameField] = useState('');
    const [emailFealed, setEmailField] = useState('');


    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNameField(user.name);
        setEmailField(user.email);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setSelectedUser(null);
        setEditModalOpen(false);
    };






    // Fetch users from API when component mounts
    useEffect(() => {
        dispatch(getUsersFromApi());
    }, []);

    const columns = useMemo(() => [
        { id: "name", Header: "الاسم", accessor: "name", align: "center" },
        { id: "role", Header: "role", accessor: "role", align: "center" },
        { id: "email", Header: "البريد الالكتروني", accessor: "email", align: "center" },
        { id: "isActive", Header: "isActive", accessor: "isActive", align: "center" },
        { id: "updatedAt", Header: "updatedAt", accessor: "updatedAt", align: "center" },
        { id: "action", Header: "action", accessor: "action", align: "center" },
    ], []);

    const rows = useMemo(() => {
        const usersToShow = users.filter(user => user.role === usersType);

        return usersToShow.map((user) => ({
            name: user.name,
            role: user.role,
            email: user.email,
            isActive: `${user.isActive}`,
            updatedAt: user.updatedAt,
            action: (
                <>
                    <MDTypography component="a" href="#" variant="caption" color="danger" fontWeight="medium">
                        <Icon fontSize="small" style={{ cursor: "pointer" }}
                            onClick={() => dispatch(deleteUserFromApi(user._id))}>
                            delete
                        </Icon>
                    </MDTypography>
                    <MDTypography component="a" href="#" variant="caption" color="danger" fontWeight="medium" ml="10px">
                        <Icon fontSize="small" style={{ cursor: "pointer" }}
                            onClick={() => handleEditUser(user)}>
                            edit
                        </Icon>
                    </MDTypography>
                </>
            ),
        }));
    }, [users, usersType]);

    return (
        <>
            <Tables tableTitle={tableTitle} rows={rows} columns={columns}>
                <Icon fontSize="large" style={{ cursor: "pointer" }} onClick={handleOpenModal}>
                    add_box
                </Icon>
            </Tables>

            {/* Modal for adding a new user */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                <DialogContent>
                    {/* Replace this with your actual form */}
                    <TextField fullWidth label="الاسم" margin="normal" />
                    <TextField fullWidth label="البريد الإلكتروني" margin="normal" />
                    <TextField fullWidth label="الدور" margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>إلغاء</Button>
                    <Button variant="contained" color="primary" onClick={() => {
                        // Add user logic here
                        console.log("Adding user...");
                        handleCloseModal();
                    }}>
                        <Typography fontSize='small' fontWeight="medium" color="white">إضافة</Typography>
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
                <DialogTitle>تعديل المستخدم</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="الاسم"
                        margin="normal"
                        value={nameFealed}
                        onChange={(e) => setNameField(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="البريد الإلكتروني"
                        margin="normal"
                        value={emailFealed}
                        onChange={(e) => setEmailField(e.target.value)}
                    />
                    <TextField
                        disabled
                        fullWidth
                        label="الدور"
                        margin="normal"
                        defaultValue={selectedUser?.role}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal}>إلغاء</Button>
                    <Button variant="contained" color="primary" onClick={() => {
                        
                        dispatch(updateUserFromApi(selectedUser._id, { 
                            id: selectedUser._id,
                            name: nameFealed,
                            email: emailFealed,
                            role: selectedUser.role,
                            cart: [],
                            wishlist: [],
                            phone: "0567822283",
                            coverImage: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/98.jpg",
                            isActive: selectedUser.isActive,
                            description: " user for the application",
                            createdAt: "2025-07-15T05:36:41.619Z",
                            updatedAt: new Date().toISOString()
                        }));
                        
                        handleCloseEditModal();
                    }}>
                        <Typography fontSize='small' fontWeight="medium" color="white">تحديث</Typography>
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default UsersTable;
