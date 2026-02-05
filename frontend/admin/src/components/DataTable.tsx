import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableContainerProps } from '@mui/material';

export interface Column<T> {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    render?: (row: T) => React.ReactNode;
    field?: keyof T;
}

interface DataTableProps<T> extends TableContainerProps {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
}

export function DataTable<T>({ columns, data, rowKey, ...props }: DataTableProps<T>) {
    return (
        <TableContainer component={Paper} {...props}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={col.id} align={col.align || 'left'}>
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={rowKey(row)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {columns.map((col) => (
                                <TableCell key={col.id} align={col.align || 'left'}>
                                    {col.render ? col.render(row) : (col.field ? String(row[col.field] ?? '') : '')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
