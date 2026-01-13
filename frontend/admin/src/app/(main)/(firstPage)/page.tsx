'use client';

import React from 'react';
import { Box, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon, TrendingUp, People, ShoppingBag } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend }: any) => (
  <Card sx={{ borderRadius: 4, height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box 
            sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                bgcolor: `${color}15`,
                color: color,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}
        >
            {icon}
        </Box>
        <IconButton size="small"><MoreVertIcon /></IconButton>
      </Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
        {trend}
      </Typography>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      
    </Box>
  );
}