import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, FormControlLabel, List, ListItem, ListItemText, Divider, Button, Collapse, Box, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

// Styled Components for CRM-like Look
const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  padding: theme.spacing(3),
  backgroundColor: '#f5f7fa',
  borderRight: '1px solid #e0e0e0',
  height: '100vh',
  overflowY: 'auto',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  backgroundColor: '#fff',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
}));

const Report = () => {
  const [meetings, setMeetings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    lead: ['Name', 'Email'],
    account: ['Company Name', 'Industry'],
    meeting: ['Meeting Date', 'Meeting Status'],
    demo: ['Demo Date', 'Demo Status'],
    deal: ['Deal Name', 'Deal Stage'],
  });
  const [expandedSections, setExpandedSections] = useState({
    lead: true,
    account: true,
    meeting: true,
    demo: true,
    deal: true,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch Data Functions
  const fetchData = async (endpoint, setter, errorMessage) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    
      if (response.data) {
        setter(response.data[endpoint] || []);
        console.log(response.data)
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('meeting', setMeetings, 'Failed to fetch meetings!');
    // fetchData('lead', setLeads, 'Failed to fetch leads!');
    fetchData('accounts', setAccounts, 'Failed to fetch accounts!');
    fetchData('deal', setDeals, 'Failed to fetch deals!');
    console.log(meetings,leads, accounts, deals)
  }, []);

  // Handle Checkbox Changes
  const handleCheckboxChange = (category, field) => {
   
    setSelectedFields((prev) => ({
      ...prev,
      [category]: prev[category].includes(field)
        ? prev[category].filter((item) => item !== field)
        : [...prev[category], field],
    }));
  };

  // Toggle Sidebar Sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Process Data for Charts
  const processMeetingsData = () => {
    const scheduled = meetings.length;
    const postponed = meetings.filter((m) => m.status === 'postponed').length;
    const completed = meetings.filter((m) => m.status === 'completed').length;
    return [
      { name: 'Scheduled', value: scheduled, fill: '#4dabf5' },
      { name: 'Postponed', value: postponed, fill: '#ff9800' },
      { name: 'Completed', value: completed, fill: '#4caf50' },
    ];
  };

  const processDealsData = () => {
    const stages = {};
    deals.forEach((deal) => {
      stages[deal.stage] = (stages[deal.stage] || 0) + 1;
    });
    return Object.entries(stages).map(([stage, count], index) => ({
      name: stage,
      value: count,
      fill: ['#4dabf5', '#ff9800', '#4caf50', '#f44336', '#9c27b0'][index % 5],
    }));
  };

  // Field Mapping (adjust based on your API response)
  const fieldMapping = {
    'Name': 'name',
    'Email': 'email',
    'Phone': 'phone',
    'Company': 'company',
    'Website': 'website',
    'LinkedIn': 'linkedin',
    'Company Name': 'companyName',
    'Industry': 'industry',
    'Employee Size': 'employeeSize',
    'Revenue': 'revenue',
    'Add to Dartboard': 'addToDartboard',
    'Is Target Account': 'isTargetAccount',
    'Meeting Date': 'date',
    'Meeting Time': 'time',
    'Meeting Type': 'type',
    'Meeting Status': 'status',
    'Meeting Feedback': 'feedback',
    'Demo Date': 'date',
    'Demo Time': 'time',
    'Demo Status': 'status',
    'Demo Feedback': 'feedback',
    'Deal Name': 'name',
    'Deal Stage': 'stage',
    'Deal Value': 'value',
    'Deal Status': 'status',
    'Deal Feedback': 'feedback',
  };

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h5" color="textPrimary" gutterBottom>
          Customize Report
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {[
          { title: 'Lead', fields: ['Name', 'Email', 'Phone', 'Company', 'Website', 'LinkedIn'], key: 'lead' },
          { title: 'Account', fields: ['Company Name', 'Website', 'Industry', 'Employee Size', 'Revenue', 'Add to Dartboard', 'Is Target Account'], key: 'account' },
          { title: 'Meeting', fields: ['Meeting Date', 'Meeting Time', 'Meeting Type', 'Meeting Status', 'Meeting Feedback'], key: 'meeting' },
          { title: 'Demo', fields: ['Demo Date', 'Demo Time', 'Demo Status', 'Demo Feedback'], key: 'demo' },
          { title: 'Deal', fields: ['Deal Name', 'Deal Stage', 'Deal Value', 'Deal Status', 'Deal Feedback'], key: 'deal' },
        ].map((section) => (
          <Box key={section.key} mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" onClick={() => toggleSection(section.key)} sx={{ cursor: 'pointer' }}>
              <Typography variant="subtitle1" color="textSecondary">{section.title}</Typography>
              {expandedSections[section.key] ? <ExpandLess /> : <ExpandMore />}
            </Box>
            <Collapse in={expandedSections[section.key]}>
              <List dense>
                {section.fields.map((field) => (
                  <ListItem key={field} disablePadding>
                    <FormControlLabel
                      control={<Checkbox checked={selectedFields[section.key].includes(field)} onChange={() => handleCheckboxChange(section.key, field)} />}
                      label={<ListItemText primary={field} />}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" color="textPrimary">Sales Report Dashboard</Typography>
          <Button variant="contained" color="primary" size="small">Export Report</Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3}>
              {[
                { title: 'Total Meetings', value: meetings.length, color: '#4dabf5' },
                { title: 'Total Leads', value: leads.length, color: '#ff9800' },
                { title: 'Total Accounts', value: accounts.length, color: '#4caf50' },
                { title: 'Total Deals', value: deals.length, color: '#f44336' },
              ].map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="textSecondary">{stat.title}</Typography>
                      <Typography variant="h4" sx={{ color: stat.color }}>{stat.value}</Typography>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="textPrimary">Meetings Overview</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={processMeetingsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="textPrimary">Deals by Stage</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={processDealsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>

            {/* Tables */}
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="textPrimary">Recent Meetings</Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {selectedFields.meeting.map((field) => (
                              <TableCell key={field}><Typography variant="subtitle2">{field}</Typography></TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {meetings.slice(0, 5).map((meeting) => (
                            <TableRow key={meeting._id || meeting.id}>
                              {selectedFields.meeting.map((field) => (
                                <TableCell key={field}>{meeting[fieldMapping[field]] || 'N/A'}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="textPrimary">Recent Deals</Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {selectedFields.deal.map((field) => (
                              <TableCell key={field}><Typography variant="subtitle2">{field}</Typography></TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {deals.slice(0, 5).map((deal) => (
                            <TableRow key={deal._id || deal.id}>
                              {selectedFields.deal.map((field) => (
                                <TableCell key={field}>{deal[fieldMapping[field]] || 'N/A'}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </>
        )}
      </MainContent>
    </Box>
  );
};

export default Report;