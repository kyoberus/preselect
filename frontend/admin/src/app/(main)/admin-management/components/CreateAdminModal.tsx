import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { createAdmin } from '@/services/admin.service';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { PASSWORD_REGEX } from '@/constants';

interface CreateAdminModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ open, onClose, onSuccess }) => {
    const { showSnackbar } = useSnackbar();
    const [createFormData, setCreateFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: ""
    });

    const isPasswordValid = !createFormData.password || PASSWORD_REGEX.test(createFormData.password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    };

    const handleCreateSubmit = async () => {
        if (createFormData.password !== createFormData.confirm_password) return;
        try {
            await createAdmin({
                first_name: createFormData.first_name,
                last_name: createFormData.last_name,
                email: createFormData.email,
                phone: createFormData.phone,
                password: createFormData.password
            });
            onSuccess();
            onClose();
            setCreateFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                password: "",
                confirm_password: ""
            });
            showSnackbar("Admin created successfully", "success");
        } catch (error: any) {
            console.error("Failed to create admin", error);
            showSnackbar(error?.response?.data?.detail || "Failed to create admin", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Admin</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="First Name"
                    name="first_name"
                    fullWidth
                    value={createFormData.first_name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Last Name"
                    name="last_name"
                    fullWidth
                    value={createFormData.last_name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={createFormData.email}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={createFormData.phone}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    value={createFormData.password}
                    onChange={handleChange}
                    error={!isPasswordValid}
                    helperText={!isPasswordValid ? "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number." : ""}
                />
                <TextField
                    margin="dense"
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    fullWidth
                    value={createFormData.confirm_password}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleCreateSubmit}
                    variant="contained"
                    disabled={
                        !createFormData.email ||
                        !createFormData.password ||
                        createFormData.password !== createFormData.confirm_password ||
                        !PASSWORD_REGEX.test(createFormData.password)
                    }
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAdminModal;
