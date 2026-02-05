'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import { getAdmins } from '@/services/admin.service';
import { Admin as AdminType } from '@/@types/admin.type';
import CreateAdminModal from './CreateAdminModal';
import UpdateAdminModal from './UpdateAdminModal';
import SetAdminPasswordModal from './SetAdminPasswordModal';
import { DataTable, Column } from '@/components/DataTable';

const AdminManagementPage = () => {
    const [admins, setAdmins] = useState<AdminType[]>([]);

    // Modal States
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminType | null>(null);

    const fetchAdmins = async () => {
        try {
            const data = await getAdmins();
            if (data) {
                setAdmins(data);
            }
        } catch (error) {
            console.error("Failed to fetch admins", error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Create Handlers
    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    // Update Handlers
    const handleOpenUpdate = (admin: AdminType) => {
        setSelectedAdmin(admin);
        setOpenUpdate(true);
    };
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setSelectedAdmin(null);
    };

    // Password Handlers
    const handleOpenPassword = (admin: AdminType) => {
        setSelectedAdmin(admin);
        setOpenPassword(true);
    };
    const handleClosePassword = () => {
        setOpenPassword(false);
        setSelectedAdmin(null);
    };

    const columns: Column<AdminType>[] = [
        { id: 'first_name', label: 'Firstname', field: 'first_name' },
        { id: 'last_name', label: 'Lastname', field: 'last_name' },
        { id: 'email', label: 'Email', field: 'email' },
        { id: 'phone', label: 'Phone', field: 'phone' },
        {
            id: 'date_created',
            label: 'Date Created',
            render: (row) => row.date_created ? new Date(row.date_created).toLocaleString() : '-'
        },
        {
            id: 'date_updated',
            label: 'Date Updated',
            render: (row) => row.date_updated ? new Date(row.date_updated).toLocaleString() : '-'
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'center',
            render: (row) => (
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Update Admin">
                        <IconButton color="primary" onClick={() => handleOpenUpdate(row)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Set Password">
                        <IconButton color="error" onClick={() => handleOpenPassword(row)}>
                            <LockResetIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ];

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Admin Management
                </Typography>
                <Button variant="contained" onClick={handleOpenCreate}>
                    Create Admin
                </Button>
            </Stack>

            <DataTable
                columns={columns}
                data={admins}
                rowKey={(row) => row.id}
            />

            <CreateAdminModal
                open={openCreate}
                onClose={handleCloseCreate}
                onSuccess={fetchAdmins}
            />

            <UpdateAdminModal
                open={openUpdate}
                onClose={handleCloseUpdate}
                admin={selectedAdmin}
                onSuccess={fetchAdmins}
            />

            <SetAdminPasswordModal
                open={openPassword}
                onClose={handleClosePassword}
                admin={selectedAdmin}
            />
        </Box>
    );
}

export default AdminManagementPage;
