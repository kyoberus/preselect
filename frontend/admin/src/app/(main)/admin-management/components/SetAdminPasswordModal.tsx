import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { setPassword } from '@/services/admin.service';
import { Admin as AdminType } from '@/@types/admin.type';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { PASSWORD_REGEX } from '@/constants';

interface SetAdminPasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    admin: AdminType | null;
}

const SetAdminPasswordModal: React.FC<SetAdminPasswordModalProps> = ({ open, onClose, admin }) => {
    const { showSnackbar } = useSnackbar();
    const [passwordData, setPasswordData] = useState("");
    const [confirmPasswordData, setConfirmPasswordData] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const isPasswordValid = !passwordData || PASSWORD_REGEX.test(passwordData);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setPasswordData("");
            setConfirmPasswordData("");
            setPasswordError("");
        }
    }, [open]);

    const handlePasswordSubmit = async () => {
        if (!admin) return;
        if (passwordData !== confirmPasswordData) {
            setPasswordError("Passwords do not match");
            return;
        }
        if (!passwordData) {
            setPasswordError("Password cannot be empty");
            return;
        }
        if (!PASSWORD_REGEX.test(passwordData)) {
            setPasswordError("Password does not meet requirements");
            return;
        }

        try {
            await setPassword(admin.id, passwordData);
            onClose();
            showSnackbar("Password updated successfully", "success");
        } catch (error) {
            console.error("Failed to set password", error);
            showSnackbar("Failed to set password", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Set Password for {admin?.email}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="New Password"
                    type="password"
                    fullWidth
                    value={passwordData}
                    onChange={(e) => {
                        setPasswordData(e.target.value);
                        setPasswordError("");
                    }}
                    error={!isPasswordValid}
                    helperText={!isPasswordValid ? "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number." : ""}
                />
                <TextField
                    margin="dense"
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    value={confirmPasswordData}
                    onChange={(e) => {
                        setConfirmPasswordData(e.target.value);
                        setPasswordError("");
                    }}
                    error={!!passwordError}
                    helperText={passwordError}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handlePasswordSubmit}
                    variant="contained"
                    color="error"
                    disabled={!passwordData || passwordData !== confirmPasswordData || !isPasswordValid}
                >
                    Set Password
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SetAdminPasswordModal;
