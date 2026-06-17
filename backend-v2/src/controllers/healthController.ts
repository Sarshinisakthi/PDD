import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// @desc    Get health records for logged-in user
// @route   GET /api/health
// @access  Private
export const getHealthRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;

    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get latest health record
// @route   GET /api/health/latest
// @access  Private
export const getLatestHealthRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;

    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Insert simulated health record
// @route   POST /api/health/simulate
// @access  Private
export const simulateHealthRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;

    const heartRate = Math.floor(Math.random() * (120 - 55 + 1)) + 55;
    const spo2 = Math.floor(Math.random() * (100 - 90 + 1)) + 90;
    const systolic = Math.floor(Math.random() * (145 - 90 + 1)) + 90;
    const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
    const temperature = parseFloat((Math.random() * (101 - 97) + 97).toFixed(1));

    const record = {
      user_id: userId,
      heart_rate: heartRate,
      spo2,
      blood_pressure_systolic: systolic,
      blood_pressure_diastolic: diastolic,
      temperature,
    };

    const { data, error } = await supabase.from('health_records').insert(record).select().single();
    if (error) throw error;

    // Auto-generate alerts for abnormal values
    const alertsToInsert = [];
    if (heartRate > 100 || heartRate < 60) alertsToInsert.push({ user_id: userId, alert_type: 'Heart Rate', message: `Abnormal heart rate: ${heartRate} bpm`, severity: heartRate > 110 ? 'critical' : 'high' });
    if (spo2 < 95) alertsToInsert.push({ user_id: userId, alert_type: 'SpO2', message: `Low oxygen level: ${spo2}%`, severity: spo2 < 90 ? 'critical' : 'high' });
    if (systolic > 130 || diastolic > 85) alertsToInsert.push({ user_id: userId, alert_type: 'Blood Pressure', message: `High BP: ${systolic}/${diastolic} mmHg`, severity: systolic > 140 ? 'critical' : 'high' });
    if (temperature > 99.5) alertsToInsert.push({ user_id: userId, alert_type: 'Temperature', message: `High temperature: ${temperature}°F`, severity: temperature > 102 ? 'critical' : 'medium' });

    if (alertsToInsert.length > 0) {
      await supabase.from('alerts').insert(alertsToInsert);
    }

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Post manual health record
// @route   POST /api/health
// @access  Private
export const addHealthRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;
    const { heart_rate, spo2, blood_pressure_systolic, blood_pressure_diastolic, temperature } = req.body;

    const { data, error } = await supabase
      .from('health_records')
      .insert({ user_id: userId, heart_rate, spo2, blood_pressure_systolic, blood_pressure_diastolic, temperature })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all alerts for user
// @route   GET /api/health/alerts
// @access  Private
export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.uid;
    const { data, error } = await supabase.from('alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Mark alert as read
// @route   PATCH /api/health/alerts/:id/read
// @access  Private
export const markAlertRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('alerts').update({ is_read: true }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
