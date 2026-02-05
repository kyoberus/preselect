import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { updateAdmin } from '@/services/admin.service';
import { Admin as AdminType } from '@/@types/admin.type';
import { useSnackbar } from '@/contexts/SnackbarContext';

interface UpdateAdminModalProps {
    open: boolean;
    onClose: () => void;
    admin: AdminType | null;
    onSuccess: () => void;
}

const UpdateAdminModal: React.FC<UpdateAdminModalProps> = ({ open, onClose, admin, onSuccess }) => {
    const { showSnackbar } = useSnackbar();
    const [updateFormData, setUpdateFormData] = useState<Partial<AdminType>>({});

    useEffect(() => {
        if (admin) {
            setUpdateFormData({
                first_name: admin.first_name,
                last_name: admin.last_name,
                phone: admin.phone
            });
        }
    }, [admin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async () => {
        if (!admin) return;
        try {
            await updateAdmin(admin.id, updateFormData);
            onSuccess();
            onClose();
            showSnackbar("Admin updated successfully", "success");
        } catch (error) {
            console.error("Failed to update admin", error);
            showSnackbar("Failed to update admin", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Admin</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    name="first_name"
                    fullWidth
                    value={updateFormData.first_name || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Last Name"
                    name="last_name"
                    fullWidth
                    value={updateFormData.last_name || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={updateFormData.phone || ''}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleUpdateSubmit}
                    variant="contained"
                    disabled={
                        !admin || (
                            admin.first_name === updateFormData.first_name &&
                            admin.last_name === updateFormData.last_name &&
                            admin.phone === updateFormData.phone
                        )
                    }
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateAdminModal;
